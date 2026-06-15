import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#060D1A',
          50: '#0F2137',
          100: '#152D4A',
          200: '#1A3A5C',
          300: '#1E4570',
        },
        gold: {
          DEFAULT: '#C49A0A',
          50: '#FDF6E3',
          100: '#FBE9A0',
          200: '#F5CE55',
          300: '#E6AF1A',
          400: '#C49A0A',
          500: '#9E7A08',
        },
        brand: {
          bg: '#060D1A',
          card: '#0F1E35',
          border: '#1E3A5C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C49A0A 0%, #E6AF1A 50%, #F5CE55 100%)',
        'navy-gradient': 'linear-gradient(180deg, #060D1A 0%, #0D1F35 100%)',
        'glass': 'rgba(255,255,255,0.04)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'fadeUp': 'fadeUp 0.4s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(230,175,26,0.5)' },
          '50%': { boxShadow: '0 0 0 10px rgba(230,175,26,0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'gold': '0 4px 20px rgba(196,154,10,0.4)',
        'navy': '0 20px 60px rgba(0,0,0,0.5)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}

export default config
