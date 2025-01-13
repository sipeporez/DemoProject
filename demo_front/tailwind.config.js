/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily:{
      Nanum: ["Nanum Gothic"],
      Pretendard: ["Pretendard"],
      NotoSansKR: ["Noto Sans KR"]
    },
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
}

