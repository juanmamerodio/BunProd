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
          black:   '#050302',
          dark:    '#0A0807',
          surface: '#120F0D',
          card:    '#1A1512',
          border:  '#2C221A',
          gold:    '#E8D1A7', // Oro Claro
          'gold-light': '#F3E5CB',
          'gold-dark':  '#9D9167', // Oro Viejo/Oliva
          bronze:  '#84592B', // Bronce
          coffee:  '#442D1C', // Café Oscuro
          cream:   '#FBF9F6',
          muted:   '#A0958E',
          text:    '#F5EFE6',
        },
        afterbun: {
          gold:    '#E8D1A7',
          oliva:   '#9D9167',
          bronze:  '#84592B',
          coffee:  '#442D1C',
          deep:    '#050302',
        }
      },
      fontFamily: {
        sans:    ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
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
