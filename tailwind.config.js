/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D7C84',
          hover: '#0b686f',
          light: '#149ca6',
          dark: '#08575d',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          hover: '#d97706',
          light: '#fbbf24',
        },
        tertiary: {
          DEFAULT: '#E2F2F3',
          dark: '#c5e5e7',
        },
        neutral: {
          slate: '#64748B',
        },
        brand: {
          amber: '#F59E0B',
          'amber-hover': '#d97706',
          teal: '#0D7C84',
          'teal-hover': '#0b686f',
          bg: '#f8fafc',
          sidebar: '#f0f4fa',
        }
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
