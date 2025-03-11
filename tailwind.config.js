/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "light-paper": "rgb(255,255,255)",
        "dark-bg": "#141A21",
        "dark-paper": "rgba(20,26,33)",
      }
    },
  },
  plugins: [],
  darkMode: 'selector',
}