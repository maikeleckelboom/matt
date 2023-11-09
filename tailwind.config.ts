import type { Config } from 'tailwindcss';
import { materialColorPreset } from '~/lib/tailwindcss/material.preset';

const config = {
  content: ['./components/**/*.{vue,js,ts}', './layouts/**/*.vue', './pages/**/*.vue'],
  presets: [materialColorPreset({ extend: true })],
} satisfies Config;

export default config;
