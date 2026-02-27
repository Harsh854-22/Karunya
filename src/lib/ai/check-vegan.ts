import { groq } from "@/lib/groq";

export interface VeganCheckResult {
  isVegan: boolean;
  analysis: string;
  ingredientBreakdown: {
    name: string;
    isVegan: boolean;
    reason: string;
  }[];
  nonVeganIngredients: string[];
}

export async function checkVegan(
  foodName: string,
  ingredients: string[]
): Promise<VeganCheckResult> {
  if (!ingredients.length) {
    return {
      isVegan: false,
      analysis: "No ingredients detected. Unable to determine vegan status.",
      ingredientBreakdown: [],
      nonVeganIngredients: [],
    };
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert vegan nutritionist. Analyze food ingredients to determine if they are vegan. Be strict — any animal-derived ingredient (dairy, eggs, honey, gelatin, whey, casein, lard, tallow, carmine, shellac, etc.) makes the food non-vegan.`,
      },
      {
        role: "user",
        content: `Analyze this food for vegan compatibility:

Food: ${foodName}
Ingredients: ${ingredients.join(", ")}

Respond ONLY with valid JSON:
{
  "isVegan": true/false,
  "analysis": "Brief 1-2 sentence summary of the vegan status",
  "ingredientBreakdown": [
    {"name": "ingredient name", "isVegan": true/false, "reason": "brief reason"}
  ],
  "nonVeganIngredients": ["list only non-vegan ingredient names"]
}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      isVegan: parsed.isVegan ?? false,
      analysis: parsed.analysis || "",
      ingredientBreakdown: parsed.ingredientBreakdown || [],
      nonVeganIngredients: parsed.nonVeganIngredients || [],
    };
  } catch {
    console.error("Failed to parse vegan check:", content);
    return {
      isVegan: false,
      analysis: "Unable to determine vegan status. Please try again.",
      ingredientBreakdown: [],
      nonVeganIngredients: [],
    };
  }
}
