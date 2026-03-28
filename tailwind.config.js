/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jordan-yellow': '#f5c518',
        'jordan-yellow-dim': '#c9a012',
        'jordan-yellow-glow': 'rgba(245, 197, 24, 0.25)',
        'jordan-black': '#06060c',
        'jordan-card': '#111118',
        'jordan-glass': 'rgba(17, 17, 24, 0.92)',
        'jordan-border': 'rgba(255,255,255,0.07)',
        'jordan-text': '#f0f0f5',
        'jordan-muted': '#6b6b80',
        'jordan-green': '#1dcd9f',
        'jordan-red': '#ff4757',
      },
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      borderRadius: {
        'jordan': '20px',
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'slide-down': 'slideDown 0.4s ease',
        'logo-pulse': 'logoPulse 2.5s ease-in-out infinite',
        'green-flash': 'gFlash 0.6s ease 2',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        logoPulse: {
          '0%, 100%': { boxShadow: '0 0 40px rgba(245,197,24,0.25), 0 0 80px rgba(245,197,24,0.1)' },
          '50%': { boxShadow: '0 0 60px rgba(245,197,24,0.5), 0 0 100px rgba(245,197,24,0.2)' },
        },
        gFlash: {
          '0%, 100%': { boxShadow: 'inset 0 0 0 0 transparent' },
          '30%': { boxShadow: 'inset 0 0 80px 40px rgba(29,205,159,0.4)' },
        },
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}
