/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        accent: '#C8FF00',
        'accent-muted': 'rgba(200, 255, 0, 0.25)',
        card: '#F3F4F6',
      },
    },
  },

  plugins: [],
};
