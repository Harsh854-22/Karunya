"use client";

import { Leaf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full py-4 sm:py-6 px-3 sm:px-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-karunya-400" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-karunya-700 tracking-tight">
            Karunya
          </h1>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-warm-400" />
          </motion.div>
        </div>

        {/* Tagline */}
        <p className="text-karunya-500 text-base sm:text-lg md:text-xl font-light tracking-wide">
          Your AI-Powered Vegan Diet Guide
        </p>
        <p className="text-karunya-400/70 text-xs sm:text-sm mt-1 max-w-md mx-auto px-2">
          Upload a food photo — we&apos;ll tell you if it&apos;s vegan and suggest plant-based alternatives
        </p>
      </div>
    </motion.header>
  );
}
