/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "brand-primary": "var(--primary)",
        "brand-primary-hover": "var(--primary-hover)",
        "brand-secondary": "var(--secondary)",
        "brand-accent": "var(--accent)",
        "brand-dark": "var(--dark)",
        "brand-light": "var(--light-bg)",
      },
      backgroundColor: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
      },
      textColor: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        foreground: "var(--foreground)",
      },
      borderColor: {
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
      },
    },
  },
  plugins: [],
};
