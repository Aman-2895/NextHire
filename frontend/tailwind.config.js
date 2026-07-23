/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070A11",
          900: "#0B0F19",
          800: "#111726",
          700: "#181F33",
          600: "#232B44",
        },
        mist: {
          400: "#7C88A6",
          300: "#9AA5C0",
          200: "#C4CBDE",
          100: "#E7EAF3",
        },
        signal: {
          DEFAULT: "#7C5CFC",
          light: "#9C8BFF",
          dark: "#5A3FE0",
        },
        scan: {
          DEFAULT: "#FFB020",
          soft: "#FFD98A",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(124,92,252,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.08) 1px, transparent 1px)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        scanline: "scanline 2.6s linear infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
