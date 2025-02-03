import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      super: {
        50: "#f7f3ff",
        100: "#ddccff",
        200: "#c5a4ff",
        300: "#af78ff",
        400: "#925adf",
        500: "#773ac1",
        600: "#6a11b9",
        700: "#520092",
        800: "#380066",
        900: "#220042",
      },
    },
  },
  plugins: [],
} satisfies Config;
