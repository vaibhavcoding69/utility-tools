/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#ffffff",
          100: "#fafafa",
          900: "#0a0a0a",
          800: "#141414",
        },
        ink: {
          DEFAULT: "#171717",
          muted: "#737373",
          light: "#fafafa",
        },
        border: {
          DEFAULT: "#e5e5e5",
          dark: "#262626",
        },
      },
      boxShadow: {
        none: "none",
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
