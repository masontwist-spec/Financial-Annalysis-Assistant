/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf7ed',
          100: '#d5f1d4',
          200: '#aad8a9',
          300: '#7dba7b',
          400: '#57a159',
          500: '#3d8344',
          600: '#346d39',
          700: '#2b592f',
          800: '#244628',
          900: '#1d3822'
        }
      },
      boxShadow: {
        soft: '0 16px 40px rgba(15, 23, 42, 0.08)',
        pixel: '6px 6px 0 #111111'
      }
    }
  },
  plugins: []
}
