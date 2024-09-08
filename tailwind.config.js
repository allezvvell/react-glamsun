/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'glam-blue': '#A8D1FF',
      },
      fontSize: {
        10: '10px',
      },
      padding: {
        26: '6.5rem',
      },
      width: {
        500: '500px',
        380: '380px',
      },
    },
  },
  plugins: [],
};
