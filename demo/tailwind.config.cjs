/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
