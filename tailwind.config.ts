import type { Config } from 'tailwindcss';

export default {
  content: ['./components/**/*.{vue,js,ts,jsx,tsx}', './layouts/**/*.vue', './pages/**/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
