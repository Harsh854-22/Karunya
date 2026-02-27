"use client";

import { motion } from "framer-motion";
import { Leaf, Loader2 } from "lucide-react";

const messages = [
  "Identifying your food...",
  "Scanning ingredients...",
  "Checking vegan status...",
  "Finding alternatives...",
];

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto px-3 sm:px-4 py-8 sm:py-12"
    >
      <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center">
        {/* Animated leaf */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full border-2 border-karunya-200 border-t-karunya-500" />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="w-10 h-10 text-karunya-500" />
          </motion.div>
        </div>

        {/* Animated messages */}
        <div className="h-8 overflow-hidden">
          <motion.div
            animate={{ y: [0, -32, -64, -96, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            {messages.map((msg, i) => (
              <p
                key={i}
                className="h-8 flex items-center justify-center text-karunya-600 font-medium"
              >
                {msg}
              </p>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-karunya-400 text-sm">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>This usually takes 10-20 seconds</span>
        </div>
      </div>
    </motion.div>
  );
}
