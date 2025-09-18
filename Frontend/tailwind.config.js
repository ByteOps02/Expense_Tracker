/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#1a202c',
          800: '#2d3748',
          700: '#4a5568',
          600: '#718096',
          500: '#a0aec0',
          400: '#cbd5e0',
          300: '#e2e8f0',
          200: '#edf2f7',
          100: '#f7fafc',
        },
        purple: {
          600: '#7b34dd',
          500: '#805ad5',
          400: '#9f7aea',
          300: '#b794f4',
        },
        pink: {
          600: '#d53f8c',
          500: '#ed64a6',
        },
      },
    },
  },
  plugins: [],
}