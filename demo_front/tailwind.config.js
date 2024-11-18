/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily:{
      Nanum: ["Nanum Gothic"]
    },
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
}

