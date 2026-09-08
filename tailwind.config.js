/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { fontFamily: { heading: ["'Instrument Serif'", 'serif'], body: ["'Barlow'", 'sans-serif'] }, keyframes: { 'badge-pop': { '0%': { transform: 'scale(0)' }, '70%': { transform: 'scale(1.2)' }, '100%': { transform: 'scale(1)' } } }, animation: { 'badge-pop': 'badge-pop .3s ease-out' } } },
  plugins: [],
}
