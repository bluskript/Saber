import { defineConfig } from 'vite-plugin-windicss'
import colors from 'windicss/colors'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'class',
  plugins: [
    typography(),
  ],
  attributify: true,
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#0B2063',
          200: '#254EB6',
          300: '#437BEA',
          400: '#6B9EEF',
        },
        secondary: {
          100: '#140D44',
          200: '#352790',
          300: '#4D3BC4',
          400: '#6858D0',
        },
        harmonydark: {
          300: '#2D2D49',
          400: '#232339',
          500: '#1E1E2F',
          600: '#1A1A28',
          700: '#161622',
          800: '#12121C',
          850: '#0E0E16',
          900: '#08080D',
        },
        buttoncolor: 'var(--button-color)',
        sabertext: '#ADADD8',
      },
    },
  },
})
