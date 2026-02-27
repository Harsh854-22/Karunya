export interface AnalysisResponse {
  success: boolean;
  data?: {
    id: string;
    foodName: string;
    isFood: boolean;
    confidence: string;
    ingredients: {
      name: string;
      isVegan: boolean;
      reason: string;
    }[];
    isVegan: boolean;
    analysis: string;
    nonVeganIngredients: string[];
    alternatives: {
      originalIngredient: string;
      alternativeName: string;
      nutritionMatch: string;
      recipe: string;
      buyLink: string;
    }[];
  };
  error?: string;
}
