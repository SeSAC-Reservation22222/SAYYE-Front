import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#13ec13",
        "primary-light": "#C8E6C9",
        accent: "#8BC34A",
        "background-light": "#f6f8f6",
        "background-dark": "#102210",
        "text-light": "#0d1b0d",
        "text-dark": "#e7f3e7",
        "text-light-primary": "#0d1b0d",
        "text-light-secondary": "#4c9a4c",
        "text-dark-primary": "#e7f3e7",
        "text-dark-secondary": "#a2c4a2",
        "border-light": "#e7f3e7",
        "border-dark": "#3a6b35",
        "surface-light": "#ffffff",
        "surface-dark": "#1a381a",
        "content-light": "#ffffff",
        "content-dark": "#1a2c1a",
      },
      fontFamily: {
        display: ["Manrope", "Noto Sans KR", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;


