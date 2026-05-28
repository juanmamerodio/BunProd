/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:   '#0A0A0A',
          dark:    '#111111',
          surface: '#1A1A1A',
          card:    '#1E1E1E',
          border:  '#2A2A2A',
          gold:    '#C9A84C',
          'gold-light': '#E8C46A',
          'gold-dark':  '#A8873A',
          cream:   '#F5F0E8',
          muted:   '#888888',
          text:    '#E8E8E8',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'marquee':        'marquee 30s linear infinite',
        'marquee-reverse':'marquee-reverse 30s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'pulse-slow':     'pulse 4s ease-in-out infinite',
        'spin-slow':      'spin 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'gold':    '0 0 40px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 0 80px rgba(201, 168, 76, 0.2)',
        'dark':    '0 25px 60px rgba(0, 0, 0, 0.6)',
        'card':    '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
