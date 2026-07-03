/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          50: "#FAF3F6",
          100: "#F2E1E8",
          200: "#E2BECE",
          300: "#CE93AC",
          400: "#B16886",
          500: "#8F4A68",
          600: "#723A53",
          700: "#5B2C49",
          800: "#46213A",
          900: "#33182A",
          950: "#210F1B",
        },
        blush: {
          50: "#FEF9F8",
          100: "#FCEEEC",
          200: "#F8D9DA",
          300: "#E8B4BC",
          400: "#DC95A2",
          500: "#CB7187",
          600: "#B2516C",
          700: "#933D56",
        },
        rosegold: {
          400: "#D9A38B",
          500: "#C9836B",
          600: "#B16A52",
          700: "#92543F",
        },
        cream: "#FBF6F3",
        ink: "#2D1B26",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

