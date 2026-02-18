import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#E50914",
          400: "#F3303C",
        },
        surface: {
          950: "#070B14",
          900: "#0E1322",
          800: "#1A2033",
          700: "#252D43",
        },
        text: {
          50: "#F4F7FF",
          200: "#D3DAEC",
          300: "#B7C2DB",
          400: "#9CA8C3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 14px 42px rgba(6, 10, 20, 0.42)",
        glow: "0 0 0 1px rgba(243, 48, 60, 0.6), 0 10px 24px rgba(229, 9, 20, 0.32)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-fade":
          "linear-gradient(180deg, rgba(7, 11, 20, 0.1) 0%, rgba(7, 11, 20, 0.68) 52%, #070B14 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.9s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
