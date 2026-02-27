import { groq } from "@/lib/groq";

export interface ImageAnalysisResult {
  foodName: string;
  ingredients: string[];
  isFood: boolean;
  confidence: string;
}

export async function analyzeImage(
  base64Image: string,
  mimeType: string
): Promise<ImageAnalysisResult> {
  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a food ingredient analyst. Analyze this food image carefully.

If this is NOT a food item, respond with:
{"isFood": false, "foodName": "", "ingredients": [], "confidence": "high"}

If this IS a food item, identify it and list ALL likely ingredients (including hidden ones like dairy, gelatin, honey, etc.). Be thorough — include cooking oils, seasonings, binding agents, and any animal-derived ingredients.

Respond ONLY with valid JSON in this exact format:
{
  "isFood": true,
  "foodName": "Name of the dish/food",
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "confidence": "high" | "medium" | "low"
}

Be specific with ingredients. For example, instead of "cheese", say "mozzarella cheese (dairy)". If you see bread, include "wheat flour", "yeast", etc.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
  });

  const content = response.choices[0]?.message?.content || "";

  try {
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      isFood: parsed.isFood ?? true,
      foodName: parsed.foodName || "Unknown Food",
      ingredients: parsed.ingredients || [],
      confidence: parsed.confidence || "medium",
    };
  } catch {
    console.error("Failed to parse image analysis:", content);
    return {
      isFood: true,
      foodName: "Unidentified Food",
      ingredients: [],
      confidence: "low",
    };
  }
}
