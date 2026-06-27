/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: { 950: '#0a0a1f', 900: '#0f0f2e', 800: '#181842' },
        lavender: { 300: '#c4b5fd', 400: '#a78bfa' },
        dimgold: { 300: '#fcd34d', 400: '#facc15' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      backdropBlur: { '3xl': '64px' },
      boxShadow: { glow: '0 0 40px -10px rgba(167,139,250,0.4)' },
    },
  },
  plugins: [],
};
