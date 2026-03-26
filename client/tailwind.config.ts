import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#0A0F1E',
          secondary: '#111827',
          tertiary: '#1A2235',
          hover: '#1E2A40',
        },
        accent: {
          primary: '#6C63FF',
          secondary: '#22D3EE',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      borderColor: {
        default: 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
