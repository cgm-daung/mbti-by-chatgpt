/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans Myanmar"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        ink: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        mist: '#f7f7f8',
        accent: {
          DEFAULT: '#6366f1',
          soft: '#eef2ff',
          dark: '#4f46e5',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        float: '0 12px 40px rgba(0,0,0,0.08)',
        notion:
          '0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'notion-md':
          '0 1px 0 rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        notion: '12px',
      },
    },
  },
  plugins: [],
}
