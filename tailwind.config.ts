import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom, 0px)',
      },
      colors: {
        profit: {
          DEFAULT: '#00DC82',
          dark: '#00B468',
        },
        loss: {
          DEFAULT: '#FF4A6C',
          dark: '#D93D59',
        },
        neutral: {
          DEFAULT: '#FFB547',
          dark: '#D99A3C',
        },
        surface: {
          DEFAULT: '#141416',
          card: '#1C1C1F',
          hover: '#232326',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'candlestick-pattern': "url('/patterns/candlestick.svg')",
      },
      animation: {
        border: 'border 4s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'number-up': 'number-up 0.5s ease-out forwards',
        'number-down': 'number-down 0.5s ease-out forwards',
      },
      keyframes: {
        border: {
          '0%, 100%': { transform: 'rotate(0deg)', opacity: '0.75' },
          '50%': { transform: 'rotate(180deg)', opacity: '0.5' },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'number-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'number-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
    },
  },
  plugins: [],
};
export default config;
