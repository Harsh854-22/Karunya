import { groq } from "@/lib/groq";

export interface VeganAlternative {
  originalIngredient: string;
  alternativeName: string;
  nutritionMatch: string;
  recipe: string;
  buyLink: string;
}

export async function getAlternatives(
  foodName: string,
  nonVeganIngredients: string[],
  allIngredients: string[]
): Promise<VeganAlternative[]> {
  if (nonVeganIngredients.length === 0) return [];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a creative vegan chef and nutritionist. Suggest vegan alternatives for non-vegan ingredients that match the nutritional profile of the original. Provide practical, delicious alternatives with simple recipes.`,
      },
      {
        role: "user",
        content: `The food "${foodName}" contains these non-vegan ingredients: ${nonVeganIngredients.join(", ")}

All ingredients in the dish: ${allIngredients.join(", ")}

For EACH non-vegan ingredient, suggest the BEST vegan alternative. Respond ONLY with valid JSON:
{
  "alternatives": [
    {
      "originalIngredient": "the non-vegan ingredient",
      "alternativeName": "suggested vegan alternative",
      "nutritionMatch": "Brief explanation of how it matches nutritionally (protein, calcium, etc.)",
      "recipe": "A simple 2-3 sentence recipe or preparation tip for using this alternative in the dish"
    }
  ]
}

Make alternatives practical and commonly available.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]);
    const alternatives: VeganAlternative[] = (parsed.alternatives || []).map(
      (alt: Omit<VeganAlternative, "buyLink">) => ({
        ...alt,
        buyLink: `https://www.amazon.com/s?k=${encodeURIComponent(alt.alternativeName + " vegan")}`,
      })
    );
    return alternatives;
  } catch {
    console.error("Failed to parse alternatives:", content);
    return nonVeganIngredients.map((ing) => ({
      originalIngredient: ing,
      alternativeName: `Vegan ${ing} substitute`,
      nutritionMatch: "Similar nutritional profile",
      recipe: "Search for vegan recipes online for the best preparation method.",
      buyLink: `https://www.amazon.com/s?k=${encodeURIComponent(ing + " vegan alternative")}`,
    }));
  }
}
