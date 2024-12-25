/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      animation: {
        'slide': 'slide 20s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'glow-border': 'glow-border 3s linear infinite',
        'glow-pulse-slow': 'glow-pulse-slow 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'reverse-spin': 'reverse-spin 12s linear infinite'
      },
      keyframes: {
        slide: {
          '0%': {
            backgroundPosition: '0 0',
          },
          '50%': {
            backgroundPosition: '100% 0',
          },
          '100%': {
            backgroundPosition: '0 0',
          },
        },
        glow1: {
          '0%, 100%': { transform: 'translate(10%, 10%) scale(1)' },
          '50%': { transform: 'translate(0%, 0%) scale(1.1)' },
        },
        glow2: {
          '0%, 100%': { transform: 'translate(-10%, 10%) scale(1.1)' },
          '50%': { transform: 'translate(0%, 0%) scale(1)' },
        },
        glow3: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '50%': { transform: 'translate(10%, 10%) scale(1.1)' },
        },
        glow4: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1.1)' },
          '50%': { transform: 'translate(-10%, 10%) scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1.1)'
          },
          '50%': {
            opacity: 0.4,
            transform: 'scale(0.9)'
          },
        },
        'glow-border': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'glow-pulse-slow': {
          '0%, 100%': {
            opacity: 0.7,
            transform: 'scale(1.2) rotate(0deg)'
          },
          '50%': {
            opacity: 0.5,
            transform: 'scale(0.8) rotate(180deg)'
          }
        },
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)',
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            transform: 'rotate(360deg)',
            backgroundPosition: '0% 50%',
          }
        },
        'reverse-spin': {
          '0%': {
            transform: 'rotate(360deg)',
            backgroundPosition: '100% 50%',
          },
          '50%': {
            backgroundPosition: '0% 50%',
          },
          '100%': {
            transform: 'rotate(0deg)',
            backgroundPosition: '100% 50%',
          }
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
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
    },
  },
  plugins: [require("tailwindcss-animate")],
};
