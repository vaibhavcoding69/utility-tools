export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "var(--bg-primary)",
          100: "var(--bg-secondary)",
          900: "var(--bg-tertiary)",
          800: "var(--bg-elevated)",
        },
        ink: {
          DEFAULT: "var(--text-primary)",
          muted: "var(--text-muted)",
          light: "var(--text-secondary)",
        },
        border: {
          DEFAULT: "var(--border-primary)",
          dark: "var(--border-secondary)",
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
