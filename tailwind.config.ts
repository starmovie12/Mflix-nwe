import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{css,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mflix: {
          bg: "#05060A",
          surface: "#0B0D14",
          surface2: "#101326",
          border: "rgba(255,255,255,0.10)",
          text: "rgba(255,255,255,0.92)",
          muted: "rgba(255,255,255,0.68)",
          faint: "rgba(255,255,255,0.48)",
          red: "#E50914",
          red2: "#FF2D55"
        }
      },
      boxShadow: {
        "soft-lg":
          "0 24px 70px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.04) inset",
        glow:
          "0 0 0 1px rgba(229,9,20,0.35), 0 18px 60px rgba(229,9,20,0.18)"
      },
      backgroundImage: {
        "radial-hero":
          "radial-gradient(1200px 500px at 12% 10%, rgba(229,9,20,0.20), transparent 60%), radial-gradient(900px 500px at 70% 0%, rgba(255,45,85,0.16), transparent 55%)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem"
      }
    }
  },
  plugins: []
} satisfies Config;

