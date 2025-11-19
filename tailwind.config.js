 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.html",    // kalau kamu pakai file .html
    "./views/**/*.ejs",     // atau kalau pakai EJS
    "./views/**/*.vue",     // atau Vue
    "./public/**/*.js",     // kalau ada JS yang pakai class Tailwind juga
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
      },
    }
  },
  plugins: [],
}