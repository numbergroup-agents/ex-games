import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        drama: {
          pink: "#e91e8c",
          purple: "#7c3aed",
          dark: "#0f0a1a",
          card: "#1a1128",
          border: "#2d1f4e",
          muted: "#9ca3af",
        },
      },
    },
  },
  plugins: [],
};

export default config;
