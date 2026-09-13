/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          amber: '#f59e0b',
          'amber-hover': '#d97706',
          teal: '#0d9488',
          'teal-hover': '#0f766e',
          bg: '#f8fafc',
          sidebar: '#f0f4fa',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
