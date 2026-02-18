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
          DEFAULT: "#E50914",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F3303C",
          500: "#E50914",
          600: "#C41010",
          700: "#991B1B",
          800: "#7F1D1D",
          900: "#450A0A",
        },
        surface: {
          DEFAULT: "#0E1322",
          950: "#070B14",
          900: "#0E1322",
          850: "#131A2C",
          800: "#1A2033",
          750: "#1F273D",
          700: "#252D43",
          600: "#334155",
          500: "#475569",
        },
        text: {
          50: "#F4F7FF",
          100: "#E8ECF7",
          200: "#D3DAEC",
          300: "#B6C0D8",
          400: "#9CA8C3",
          500: "#7A8AA8",
        },
        gold: {
          DEFAULT: "#FFC107",
          400: "#FFD54F",
          500: "#FFC107",
          600: "#FFB300",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card: "0 14px 42px rgba(6, 10, 20, 0.42)",
        "card-hover": "0 20px 50px rgba(6, 10, 20, 0.6)",
        glow: "0 0 0 1px rgba(243, 48, 60, 0.6), 0 10px 24px rgba(229, 9, 20, 0.32)",
        "glow-sm": "0 0 12px rgba(229, 9, 20, 0.25)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-fade":
          "linear-gradient(180deg, rgba(7, 11, 20, 0.1) 0%, rgba(7, 11, 20, 0.68) 52%, #070B14 100%)",
        "hero-vignette":
          "radial-gradient(ellipse at center, transparent 50%, rgba(7, 11, 20, 0.8) 100%)",
        "card-fade":
          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)",
        "nav-gradient":
          "linear-gradient(to bottom, rgba(7, 11, 20, 0.98) 0%, rgba(7, 11, 20, 0.85) 60%, transparent 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "progress-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        shimmer: "shimmer 1.9s linear infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "progress-bar": "progress-bar 2s ease-out forwards",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "450": "450ms",
      },
      screens: {
        xs: "480px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      aspectRatio: {
        poster: "2/3",
        backdrop: "16/9",
      },
    },
  },
  plugins: [],
};
export default config;
