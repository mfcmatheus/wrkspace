/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  theme: {
    extend: {
      colors: {
        primary: 'oklch(59.59% 0.24 255.09156059071347)',
        secondary: 'oklch(81.58% 0.189 190.74037768509325)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
