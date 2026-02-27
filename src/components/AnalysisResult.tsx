"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import AlternativeCard from "./AlternativeCard";
import type { AnalysisResponse } from "@/lib/types";

interface AnalysisResultProps {
  data: NonNullable<AnalysisResponse["data"]>;
  onReset: () => void;
}

export default function AnalysisResult({ data, onReset }: AnalysisResultProps) {
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // Not a food item
  if (!data.isFood) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mx-auto px-4"
      >
        <div className="glass rounded-3xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <AlertTriangle className="w-16 h-16 text-warm-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold text-karunya-700 mb-2">
            Not a Food Item
          </h3>
          <p className="text-karunya-500/70 mb-6">{data.analysis}</p>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-karunya-500 text-white 
              rounded-xl hover:bg-karunya-600 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Another Photo
          </button>
        </div>
      </motion.div>
    );
  }

  const displayedIngredients = showAllIngredients
    ? data.ingredients
    : data.ingredients.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6"
    >
      {/* Verdict Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center border-2 ${
          data.isVegan
            ? "border-karunya-400/30"
            : "border-red-300/30"
        }`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          {data.isVegan ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-karunya-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle2 className="w-9 h-9 sm:w-12 sm:h-12 text-karunya-500" />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <XCircle className="w-9 h-9 sm:w-12 sm:h-12 text-red-500" />
            </div>
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-karunya-700 mb-1"
        >
          {data.foodName}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mt-2 ${
              data.isVegan
                ? "bg-karunya-100 text-karunya-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {data.isVegan ? "✓ 100% Vegan" : "✗ Not Vegan"}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-karunya-500/80 mt-4 text-sm leading-relaxed max-w-md mx-auto"
        >
          {data.analysis}
        </motion.p>
      </motion.div>

      {/* Ingredients Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6"
      >
        <h3 className="text-base sm:text-lg font-semibold text-karunya-700 mb-3 sm:mb-4">
          Ingredient Breakdown
        </h3>

        <div className="space-y-2">
          {displayedIngredients.map((ingredient, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                ingredient.isVegan
                  ? "bg-karunya-50/50"
                  : "bg-red-50/50"
              }`}
            >
              {ingredient.isVegan ? (
                <CheckCircle2 className="w-5 h-5 text-karunya-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-karunya-700 text-sm">
                  {ingredient.name}
                </p>
                <p className="text-karunya-500/60 text-xs mt-0.5">
                  {ingredient.reason}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {data.ingredients.length > 6 && (
          <button
            onClick={() => setShowAllIngredients(!showAllIngredients)}
            className="flex items-center gap-1 mx-auto mt-4 text-sm text-karunya-500 hover:text-karunya-600 transition-colors"
          >
            {showAllIngredients ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show All ({data.ingredients.length}) <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </motion.div>

      {/* Vegan Alternatives */}
      {!data.isVegan && data.alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-karunya-700 mb-4 px-1">
            🌱 Vegan Alternatives
          </h3>
          <div className="space-y-4">
            {data.alternatives.map((alt, index) => (
              <AlternativeCard key={index} alternative={alt} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center pt-2 pb-8"
      >
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-karunya-500 text-white 
            rounded-xl hover:bg-karunya-600 transition-colors font-medium shadow-lg shadow-karunya-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          Scan Another Food
        </button>
      </motion.div>
    </motion.div>
  );
}
