/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg': '#0a0a0a',
        'text': '#f5f5f5',
        'neon': '#00fa62',
        'surface': '#111111',
        'border': '#1f1f1f',
        'muted': '#888888',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}