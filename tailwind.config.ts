import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        pine: '#183B34',
        moss: '#527765',
        sand: '#F2EEE5',
        clay: '#C97850',
        ink: '#202925',
        mist: '#E5E9E2',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        card: '0 16px 48px rgba(24, 59, 52, 0.08)',
      },
      letterSpacing: {
        'wide-caps': '0.18em',
      },
    },
  },
  plugins: [],
}

export default config
