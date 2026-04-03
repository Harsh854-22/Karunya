import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        karunya: {
          50: "#f2fdf5",
          100: "#e1fbe8",
          200: "#c4f6d3",
          300: "#96eeb4",
          400: "#5edb8e",
          500: "#34c76b",
          600: "#22a453",
          700: "#1e8245",
          800: "#1d6639",
          900: "#195431",
          950: "#0d1f17",
        },
        cream: {
          50: "#ffffff",
          100: "#fdfdfd",
          200: "#f5f5f5",
        },
        warm: {
          400: "#1e3a29",
          500: "#152c1e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
