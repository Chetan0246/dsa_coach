/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // PatternPilot palette: neutral base + cyan primary accent
        bg: {
          light: '#f8fafc',
          dark: '#0b0f14',
        },
        panel: {
          light: '#ffffff',
          dark: '#11161d',
        },
        edge: {
          light: '#e2e8f0',
          dark: '#1e2630',
        },
        ink: {
          light: '#0f172a',
          dark: '#e6edf3',
        },
        mute: {
          light: '#5b6779',
          dark: '#8b98a9',
        },
        accent: {
          DEFAULT: '#0ea5b7',
          soft: '#0ea5b71f',
        },
        good: {
          DEFAULT: '#3fb27f',
          soft: '#3fb27f22',
        },
        bad: {
          DEFAULT: '#e05e5e',
          soft: '#e05e5e22',
        },
        warn: {
          DEFAULT: '#d9a03f',
          soft: '#d9a03f22',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
