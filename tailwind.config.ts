import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          950: "#0B1120", // Deepest blue
          900: "#0F172A", // Dark royal
          800: "#1E293B", // Card background
          700: "#334155", // Borders
          600: "#475569", // Text muted
          500: "#3B82F6", // Primary action (Royal Blue)
          400: "#60A5FA", // Hover
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "royal-gradient": "linear-gradient(to bottom right, #0F172A, #0B1120)",
      },
    },
  },
  plugins: [],
};
export default config;
