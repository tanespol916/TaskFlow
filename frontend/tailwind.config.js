/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        borderc: 'var(--border)',
        textc: 'var(--text)',
        text2: 'var(--text2)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
      },
      boxShadow: {
        soft: '0 4px 32px rgba(0,0,0,0.12)',
        overlay: '0 20px 60px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}

