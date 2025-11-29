/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        gray: {
          900: "#1a202c",
          800: "#2d3748",
          700: "#4a5568",
          600: "#718096",
          500: "#a0aec0",
          400: "#cbd5e0",
          300: "#e2e8f0",
          200: "#edf2f7",
          100: "#f7fafc",
        },
        // Keep existing colors for backward compatibility if needed, 
        // but ideally we transition to semantic names or the new primary scale.
        purple: {
          600: "#7b34dd",
          500: "#805ad5",
          400: "#9f7aea",
          300: "#b794f4",
        },
        pink: {
          600: "#d53f8c",
          500: "#ed64a6",
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(124, 58, 237, 0.3)',
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
