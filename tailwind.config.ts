import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ["var(--font-space)"],
        brand: ["var(--font-brand)"],
        kola: ["var(--font-brand)"], // Kept for backward compatibility during migration
      },
    },

  },
  plugins: [],
} satisfies Config;