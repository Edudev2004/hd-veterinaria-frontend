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
          DEFAULT: '#006948',
          hover: '#005137',
          container: '#00855d',
          light: '#68dba9',
        },
        surface: {
          DEFAULT: '#f8f9ff',
          dim: '#ccdbf4',
          bright: '#f8f9ff',
          low: '#eff4ff',
          container: '#e6eeff',
          high: '#dde9ff',
          highest: '#d5e3fd',
          lowest: '#ffffff',
        },
        dark: {
          slate: '#0d1c2f',
          surface: '#233144',
        },
        secondary: {
          DEFAULT: '#565e74',
          container: '#dae2fd',
          fixed: '#131b2e',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          onContainer: '#93000a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
