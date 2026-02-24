/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00B4D8',
          dark: '#0077A8',
        },
        secondary: '#FF6B35',
      },
      fontFamily: {
        'dyslexic': ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
