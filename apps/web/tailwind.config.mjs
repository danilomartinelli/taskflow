import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00fa62',
        dark: '#0a0a0a',
        surface: '#111111',
        border: '#1f1f1f',
        muted: '#888888',
      },
    },
  },
  plugins: [],
};
export default config;