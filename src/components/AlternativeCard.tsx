"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, ChefHat } from "lucide-react";
import { useState } from "react";

interface AlternativeCardProps {
  alternative: {
    originalIngredient: string;
    alternativeName: string;
    nutritionMatch: string;
    recipe: string;
    buyLink: string;
  };
  index: number;
}

export default function AlternativeCard({
  alternative,
  index,
}: AlternativeCardProps) {
  const [showRecipe, setShowRecipe] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      className="glass rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Swap Header */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
        <span className="text-xs sm:text-sm font-medium text-red-500/80 bg-red-50 px-2.5 sm:px-3 py-1 rounded-lg">
          {alternative.originalIngredient}
        </span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-karunya-400 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-semibold text-karunya-600 bg-karunya-50 px-2.5 sm:px-3 py-1 rounded-lg">
          {alternative.alternativeName}
        </span>
      </div>

      {/* Nutrition Match */}
      <p className="text-karunya-500/70 text-xs sm:text-sm mb-3 leading-relaxed">
        {alternative.nutritionMatch}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowRecipe(!showRecipe)}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium rounded-xl
            border border-karunya-200 text-karunya-600 hover:bg-karunya-50 transition-colors"
        >
          <ChefHat className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          {showRecipe ? "Hide Recipe" : "View Recipe"}
        </button>

        <a
          href={alternative.buyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium rounded-xl
            bg-warm-400 text-white hover:bg-warm-500 transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Buy Online
        </a>
      </div>

      {/* Recipe Expandable */}
      {showRecipe && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-4 bg-karunya-50/60 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="w-4 h-4 text-karunya-500" />
            <span className="text-sm font-semibold text-karunya-700">Recipe Tip</span>
          </div>
          <p className="text-sm text-karunya-600/80 leading-relaxed">
            {alternative.recipe}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
