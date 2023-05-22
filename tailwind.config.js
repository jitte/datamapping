/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,tsx,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}