"use client";

import { Leaf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full py-8 sm:py-12 px-4"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center justify-center gap-3 mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="bg-karunya-900 text-white p-2 rounded-2xl">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-karunya-400" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold text-karunya-900 tracking-tighter">
            Karunya
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.h2 
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-karunya-900 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-center max-w-2xl leading-tight"
        >
          Your AI-Powered Vegan Guide.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-gray-500 text-sm sm:text-base mt-4 max-w-md mx-auto text-center font-medium"
        >
          Upload a photo. Know instantly if it's plant-based.
        </motion.p>
      </div>
    </motion.header>
  );
}
