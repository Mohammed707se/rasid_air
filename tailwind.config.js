/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0D1117',
          50: '#FFFFFF',
          100: '#C9D1D9',
          200: '#8B949E',
          300: '#6E7681',
          400: '#484F58',
          500: '#30363D',
          600: '#21262D',
          700: '#161B22',
          800: '#0D1117',
          900: '#010409',
        },
        highlight: {
          DEFAULT: '#00CFFF',
          50: '#E6FCFF',
          100: '#CCF9FF',
          200: '#99F3FF',
          300: '#66EDFF',
          400: '#33E7FF',
          500: '#00CFFF',
          600: '#00A6CC',
          700: '#007D99',
          800: '#005466',
          900: '#002B33',
        },
        accent: {
          DEFAULT: '#009BEB',
          50: '#E6F7FF',
          100: '#CCEFFF',
          200: '#99DFFF',
          300: '#66CFFF',
          400: '#33BFFF',
          500: '#009BEB',
          600: '#007CBC',
          700: '#005D8D',
          800: '#003E5E',
          900: '#001F2F',
        },
        secondary: '#C9D1D9',
        muted: '#8B949E',
      }
    },
  },
  plugins: [],
};