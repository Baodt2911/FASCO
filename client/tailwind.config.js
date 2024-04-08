/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        volkhov: ["Volkhov", "sans-serif"],
        jost: ["Jost", "sans-serif"],
        digital_numbers: ["Digital Numbers", "sans-serif"],
      },
    },
  },
  plugins: [],
};
