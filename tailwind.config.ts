import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mflix: {
          black: '#141414',
          dark: '#1a1a1a',
          darker: '#0d0d0d',
          red: '#e50914',
          'red-hover': '#f40612',
          gray: {
            100: '#e5e5e5',
            200: '#b3b3b3',
            300: '#808080',
            400: '#525252',
            500: '#333333',
            600: '#2f2f2f',
            700: '#1f1f1f',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': ['clamp(0.75rem, 2vw, 0.875rem)', { lineHeight: '1.25' }],
        'fluid-sm': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.375' }],
        'fluid-base': ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.5' }],
        'fluid-lg': ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.5rem, 5vw, 2rem)', { lineHeight: '1.3' }],
        'fluid-3xl': ['clamp(2rem, 6vw, 3rem)', { lineHeight: '1.2' }],
        'fluid-4xl': ['clamp(2.5rem, 8vw, 4rem)', { lineHeight: '1.1' }],
        'fluid-5xl': ['clamp(3rem, 10vw, 5rem)', { lineHeight: '1.1' }],
      },
      aspectRatio: {
        poster: '2/3',
        backdrop: '16/9',
        'backdrop-wide': '21/9',
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero':
          'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
        'gradient-hero-bottom':
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.9) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
