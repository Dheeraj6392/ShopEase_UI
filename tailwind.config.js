/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#f84040',
          ink: '#17202a',
          surface: '#f4f4f4',
          line: '#e8e8e8',
        },
        primary: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ff9d9d',
          400: '#ff6969',
          500: '#f84040',
          600: '#e52d2d',
          700: '#c11f1f',
          800: '#a11a1a',
          900: '#841a1a',
          950: '#4a0a0a',
        },
      },
    },
  },
  plugins: [],
};
