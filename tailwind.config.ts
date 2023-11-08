import type { Config } from 'tailwindcss';
import { materialColorPreset } from './lib/material-colors.preset';

const config = {
  content: ['./components/**/*.{vue,js,ts}', './layouts/**/*.vue', './pages/**/*.vue'],
  presets: [materialColorPreset],
} satisfies Config;

export default config;
