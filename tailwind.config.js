/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,tsx,jsx}',
    'node_modules/flowbite-react/**/*.{js.jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

