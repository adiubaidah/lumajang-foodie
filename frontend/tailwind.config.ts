import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "5rem",
        md: "13rem",
      },
    },
    extend: {
      fontFamily: {
        "product-sans": ["var(--font-product-sans)"],
        helvetica: ["var(--font-helvetica)"],
      },
      colors: {
        "soft-red": "#ED6368",
        gray: "#EEEEEE",
        poteh: "#F9F9F9",
        stroke: "#A4A4A4",
        orange: "#F97300",
        venetian: "#C40C0C",
        puce: "#A65F5F",
        islamic: "#0B8D00",
        davy: "#5A5A5A",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
