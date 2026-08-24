/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fffcf5',
          100: '#fffaeb',
          500: '#ff8c00',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        kumbhGold: '#d97706',
        kumbhMaroon: '#881337',
        kumbhBlue: '#1e3a8a',
      }
    },
  },
  plugins: [],
}
