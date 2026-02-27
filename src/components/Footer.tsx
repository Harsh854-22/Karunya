"use client";

import { Leaf, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-6 sm:py-8 px-3 sm:px-4 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 text-karunya-400/60 text-xs sm:text-sm">
          <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Karunya</span>
          <span className="mx-0.5 sm:mx-1">·</span>
          <span>Made with</span>
          <Heart className="w-3 h-3 fill-red-400 text-red-400" />
          <span>for a compassionate world</span>
        </div>
        <p className="text-karunya-400/40 text-[10px] sm:text-xs mt-1.5 sm:mt-2 px-2">
          Powered by AI — Results are suggestions, always verify ingredients for dietary needs
        </p>
      </div>
    </footer>
  );
}
