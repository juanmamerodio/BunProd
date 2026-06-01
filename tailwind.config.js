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
          // ── Core Foundations ──
          black:   '#090820',   // Deep space base
          dark:    '#0D0B28',   // Slightly lifted dark surface
          surface: '#110F30',   // Card/panel surface
          card:    '#16143A',   // Elevated card layer
          border:  '#2A2660',   // Subtle violet border

          // ── Primary Accents ──
          violet:       '#7030EF',   // Primary accent
          'violet-light': '#8B4FF5', // Hover/lifted violet
          'violet-dark':  '#5520C4', // Pressed/deep violet
          fuchsia:      '#DB1FFF',   // Secondary accent / highlight
          'fuchsia-light':'#E54FFF', // Lighter fuchsia
          'fuchsia-dark': '#AA10CC', // Deep fuchsia

          // ── Neutral Highs ──
          white:  '#FFFFFF',
          cream:  '#F0EEFF',   // Warm white with violet tint
          muted:  '#8B87C0',   // Desaturated violet for body text
          text:   '#EAE8FF',   // Primary text on dark bg
        },
      },
      fontFamily: {
        sans:     ['Poppins', 'system-ui', 'sans-serif'],
        headline: ['Poppins', 'system-ui', 'sans-serif'],
        display:  ['Playfair Display', 'serif'],
        body:     ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'lens':      'cubic-bezier(0.22, 0.68, 0, 1)',
        'spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'marquee':         'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'float':           'float 6s ease-in-out infinite',
        'pulse-slow':      'pulse 4s ease-in-out infinite',
        'spin-slow':       'spin 20s linear infinite',
        'glow-pulse':      'glow-pulse 3s ease-in-out infinite',
        'shimmer-border':  'shimmer-border 4s linear infinite',
        'gradient-shift':  'gradient-shift 8s ease-in-out infinite',
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
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '0.85', transform: 'scale(1.06)' },
        },
        'shimmer-border': {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        // Violet gradient presets
        'violet-gradient':  'linear-gradient(135deg, #7030EF 0%, #DB1FFF 100%)',
        'violet-subtle':    'linear-gradient(135deg, rgba(112,48,239,0.15) 0%, rgba(219,31,255,0.1) 100%)',
        'depth-gradient':   'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(17,15,48,0.5) 0%, rgba(9,8,32,1) 70%)',
      },
      boxShadow: {
        'violet':      '0 0 40px rgba(112, 48, 239, 0.18), 0 0 80px rgba(219, 31, 255, 0.08)',
        'violet-lg':   '0 0 80px rgba(112, 48, 239, 0.22), 0 0 140px rgba(219, 31, 255, 0.12)',
        'violet-glow': '0 0 20px rgba(112, 48, 239, 0.3)',
        'fuchsia-glow':'0 0 24px rgba(219, 31, 255, 0.25)',
        'dark':        '0 25px 60px rgba(0, 0, 0, 0.7)',
        'card':        '0 8px 32px rgba(0, 0, 0, 0.5)',
        'card-hover':  '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(112, 48, 239, 0.08)',
      },
      backdropBlur: {
        '3xl': '64px',
        '4xl': '96px',
      },
    },
  },
  plugins: [],
}
