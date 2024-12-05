/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        "light-blue": colors.sky,
        cyan: colors.cyan,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      width: {
        120: "110%",
      },
      height: {
        120: "100%",
      },
      inset: {
        "-10": "-10%",
      },
      borderRadius: {
        100: "100%",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        glow1: "glow1 4s linear infinite",
        glow2: "glow2 4s linear infinite",
        glow3: "glow3 4s linear infinite",
        glow4: "glow4 4s linear infinite",
      },
      keyframes: {
        glow1: {
          "0%": { transform: "translate(10%, 10%) scale(1)" },
          "25%": { transform: "translate(-10%, 10%) scale(1)" },
          "50%": { transform: "translate(-10%, -10%) scale(1)" },
          "75%": { transform: "translate(10%, -10%) scale(1)" },
          "100%": { transform: "translate(10%, 10%) scale(1)" },
        },
        glow2: {
          "0%": { transform: "translate(-10%, -10%) scale(1)" },
          "25%": { transform: "translate(10%, -10%) scale(1)" },
          "50%": { transform: "translate(10%, 10%) scale(1)" },
          "75%": { transform: "translate(-10%, 10%) scale(1)" },
          "100%": { transform: "translate(-10%, -10%) scale(1)" },
        },
        glow3: {
          "0%": { transform: "translate(-10%, 10%) scale(1)" },
          "25%": { transform: "translate(-10%, -10%) scale(1)" },
          "50%": { transform: "translate(10%, -10%) scale(1)" },
          "75%": { transform: "translate(10%, 10%) scale(1)" },
          "100%": { transform: "translate(-10%, 10%) scale(1)" },
        },
        glow4: {
          "0%": { transform: "translate(10%, -10%) scale(1)" },
          "25%": { transform: "translate(10%, 10%) scale(1)" },
          "50%": { transform: "translate(-10%, 10%) scale(1)" },
          "75%": { transform: "translate(-10%, -10%) scale(1)" },
          "100%": { transform: "translate(10%, -10%) scale(1)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
