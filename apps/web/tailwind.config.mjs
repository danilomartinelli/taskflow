/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00fa62',
        background: '#0a0a0a',
        border: 'rgb(24 24 27)',
        zinc: {
          800: '#27272a',
          700: '#3f3f46',
          900: '#18181b',
          950: '#0a0a0a'
        }
      },
    },
  },
  plugins: [],
}