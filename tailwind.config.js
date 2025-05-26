/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '36rem',
        sm: '48rem',
        md: '62rem',
        lg: '75rem',
        xl: '88rem',
      },
    },
    fontFamily: `'Vazirmatn', sans-serif`,
  },
  prefix: 'tw-',
  plugins: [],
}
