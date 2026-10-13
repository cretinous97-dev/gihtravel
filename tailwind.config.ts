import type { Config } from 'tailwindcss'

/**
 * Design system tokens for GIH Tour and Travel.
 * Aesthetic: minimalist, serene, editorial — Bhutanese visual culture
 * (prayer flags, dzong architecture, Himalayan landscapes), restrained.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './sanity/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: warm ochre / saffron (prayer-flag gold)
        ochre: {
          DEFAULT: '#D98E04',
          50: '#FBF3E2',
          100: '#F6E4BC',
          200: '#ECCB84',
          300: '#E3B24D',
          400: '#D98E04',
          500: '#B87603',
          600: '#945D02',
          700: '#714602',
          800: '#4E3001',
          900: '#2B1A00',
        },
        // Secondary: deep Himalayan blue (dzong walls at dusk)
        himalaya: {
          DEFAULT: '#1B3A5C',
          50: '#EDF2F7',
          100: '#D3DFEA',
          200: '#A6BFD5',
          300: '#7298B8',
          400: '#416C8F',
          500: '#2B4E6E',
          600: '#1B3A5C',
          700: '#142C47',
          800: '#0E2033',
          900: '#07131F',
        },
        // Accent: terracotta (temple clay)
        terracotta: {
          DEFAULT: '#C1502E',
          100: '#F5DDD5',
          200: '#E8B4A3',
          300: '#D8805F',
          400: '#C1502E',
          500: '#9E4024',
          600: '#7B321C',
          700: '#582414',
        },
        // Neutral: sage green (alpine forest) + warm off-white
        sage: {
          DEFAULT: '#7C8B6F',
          100: '#ECEFE8',
          200: '#D5DCCD',
          300: '#B6C1A8',
          400: '#98A686',
          500: '#7C8B6F',
          600: '#637058',
          700: '#4A5442',
          800: '#33392D',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          100: '#F3EEE5',
          200: '#E9E1D3',
        },
        // Near-black charcoal, never pure black
        charcoal: {
          DEFAULT: '#22201C',
          soft: '#403C35',
          muted: '#6B6459',
        },
      },
      fontFamily: {
        // Headings: Playfair Display (serif), editorial scale
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        // Body: Inter (sans-serif), 16–18px base
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Type scale — generous line height, comfortable measure (65–75 chars)
        'display-1': ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'heading-1': ['clamp(1.875rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'heading-2': ['clamp(1.5rem, 2.5vw, 2.125rem)', { lineHeight: '1.2' }],
        'heading-3': ['clamp(1.25rem, 2vw, 1.625rem)', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        body: ['1.0625rem', { lineHeight: '1.75' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.7' }],
      },
      maxWidth: {
        // Comfortable reading measure
        measure: '42rem',
        'measure-wide': '52rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(34, 32, 28, 0.04), 0 8px 24px rgba(34, 32, 28, 0.06)',
        lift: '0 2px 4px rgba(34, 32, 28, 0.05), 0 16px 40px rgba(34, 32, 28, 0.1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
