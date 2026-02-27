import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai/analyze-image";
import { checkVegan } from "@/lib/ai/check-vegan";
import { getAlternatives } from "@/lib/ai/get-alternatives";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export const maxDuration = 60; // Allow up to 60s for AI processing

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || request.headers.get("x-real-ip") 
      || "anonymous";
    const { success: rateLimitOk, remaining } = rateLimit(ip);
    if (!rateLimitOk) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a moment and try again." },
        { 
          status: 429,
          headers: { "Retry-After": "60" },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Compute hash for caching
    const imageHash = crypto.createHash("md5").update(buffer).digest("hex");

    // Check cache
    try {
      const cached = await prisma.foodScan.findFirst({
        where: { imageHash },
        include: { alternatives: true },
        orderBy: { createdAt: "desc" },
      });

      if (cached) {
        return NextResponse.json({
          success: true,
          data: {
            id: cached.id,
            foodName: cached.foodName,
            isFood: true,
            confidence: "high",
            ingredients: cached.ingredients as { name: string; isVegan: boolean; reason: string }[],
            isVegan: cached.isVegan,
            analysis: cached.analysis,
            nonVeganIngredients: (cached.nonVeganIngredients as string[]) || [],
            alternatives: cached.alternatives.map((alt: { originalIngredient: string; alternativeName: string; nutritionMatch: string; recipe: string; buyLink: string }) => ({
              originalIngredient: alt.originalIngredient,
              alternativeName: alt.alternativeName,
              nutritionMatch: alt.nutritionMatch,
              recipe: alt.recipe,
              buyLink: alt.buyLink,
            })),
          },
        });
      }
    } catch (dbError) {
      // If DB is unavailable, continue without cache
      console.warn("Database unavailable, skipping cache:", dbError);
    }

    // Step 1: Analyze image with vision model
    const imageAnalysis = await analyzeImage(base64, file.type);

    if (!imageAnalysis.isFood) {
      return NextResponse.json({
        success: true,
        data: {
          id: "",
          foodName: "",
          isFood: false,
          confidence: imageAnalysis.confidence,
          ingredients: [],
          isVegan: false,
          analysis: "This doesn't appear to be a food item. Please upload a photo of food to analyze.",
          nonVeganIngredients: [],
          alternatives: [],
        },
      });
    }

    // Step 2: Check vegan status
    const veganCheck = await checkVegan(imageAnalysis.foodName, imageAnalysis.ingredients);

    // Step 3: Get alternatives if not vegan
    let alternatives: {
      originalIngredient: string;
      alternativeName: string;
      nutritionMatch: string;
      recipe: string;
      buyLink: string;
    }[] = [];

    if (!veganCheck.isVegan && veganCheck.nonVeganIngredients.length > 0) {
      alternatives = await getAlternatives(
        imageAnalysis.foodName,
        veganCheck.nonVeganIngredients,
        imageAnalysis.ingredients
      );
    }

    // Save to database
    let savedId = "";
    try {
      const saved = await prisma.foodScan.create({
        data: {
          imageHash,
          foodName: imageAnalysis.foodName,
          ingredients: veganCheck.ingredientBreakdown,
          isVegan: veganCheck.isVegan,
          nonVeganIngredients: veganCheck.nonVeganIngredients,
          analysis: veganCheck.analysis,
          alternatives: {
            create: alternatives.map((alt) => ({
              originalIngredient: alt.originalIngredient,
              alternativeName: alt.alternativeName,
              nutritionMatch: alt.nutritionMatch,
              recipe: alt.recipe,
              buyLink: alt.buyLink,
            })),
          },
        },
      });
      savedId = saved.id;
    } catch (dbError) {
      console.warn("Failed to save to database:", dbError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: savedId,
        foodName: imageAnalysis.foodName,
        isFood: true,
        confidence: imageAnalysis.confidence,
        ingredients: veganCheck.ingredientBreakdown,
        isVegan: veganCheck.isVegan,
        analysis: veganCheck.analysis,
        nonVeganIngredients: veganCheck.nonVeganIngredients,
        alternatives,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze image. Please try again.",
      },
      { status: 500 }
    );
  }
}
