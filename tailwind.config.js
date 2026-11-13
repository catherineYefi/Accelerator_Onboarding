/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#0b0c0d', 900: '#111214', 850: '#16181a', 800: '#1c1e21', 700: '#25282b' },
        lime: { DEFAULT: '#e6f27c', soft: 'rgba(230,242,124,0.12)', line: 'rgba(230,242,124,0.28)' },
        fg: { DEFAULT: '#f3f4f0', 2: '#b4b8b1', 3: '#7d827b' },
        line: 'rgba(255,255,255,0.08)',
        warn: '#f5b84a',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '18px', '3xl': '24px' },
    },
  },
  plugins: [],
}
