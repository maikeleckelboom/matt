import { type Config } from 'tailwindcss';
import { materialColorsPlugin } from './material.plugin';

type MaterialColorPluginOptions = {
  extend?: boolean;
};

const colorsConfig = {
  colors: {
    primary: {
      DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
      light: 'rgb(var(--primary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--primary-dark-rgb) / <alpha-value>)',
    },
    'on-primary': {
      DEFAULT: 'rgb(var(--on-primary-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-primary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-primary-dark-rgb) / <alpha-value>)',
    },
    'primary-container': {
      DEFAULT: 'rgb(var(--primary-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--primary-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--primary-container-dark-rgb) / <alpha-value>)',
    },
    'on-primary-container': {
      DEFAULT: 'rgb(var(--on-primary-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-primary-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-primary-container-dark-rgb) / <alpha-value>)',
    },
    secondary: {
      DEFAULT: 'rgb(var(--secondary-rgb) / <alpha-value>)',
      light: 'rgb(var(--secondary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--secondary-dark-rgb) / <alpha-value>)',
    },
    'on-secondary': {
      DEFAULT: 'rgb(var(--on-secondary-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-secondary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-secondary-dark-rgb) / <alpha-value>)',
    },
    'secondary-container': {
      DEFAULT: 'rgb(var(--secondary-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--secondary-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--secondary-container-dark-rgb) / <alpha-value>)',
    },
    'on-secondary-container': {
      DEFAULT: 'rgb(var(--on-secondary-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-secondary-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-secondary-container-dark-rgb) / <alpha-value>)',
    },
    tertiary: {
      DEFAULT: 'rgb(var(--tertiary-rgb) / <alpha-value>)',
      light: 'rgb(var(--tertiary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--tertiary-dark-rgb) / <alpha-value>)',
    },
    'on-tertiary': {
      DEFAULT: 'rgb(var(--on-tertiary-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-tertiary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-tertiary-dark-rgb) / <alpha-value>)',
    },
    'tertiary-container': {
      DEFAULT: 'rgb(var(--tertiary-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--tertiary-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--tertiary-container-dark-rgb) / <alpha-value>)',
    },
    'on-tertiary-container': {
      DEFAULT: 'rgb(var(--on-tertiary-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-tertiary-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-tertiary-container-dark-rgb) / <alpha-value>)',
    },
    surface: {
      DEFAULT: 'rgb(var(--surface-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-dark-rgb) / <alpha-value>)',
    },
    'on-surface': {
      DEFAULT: 'rgb(var(--on-surface-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-surface-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-surface-dark-rgb) / <alpha-value>)',
    },
    background: {
      DEFAULT: 'rgb(var(--background-rgb) / <alpha-value>)',
      light: 'rgb(var(--background-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--background-dark-rgb) / <alpha-value>)',
    },
    'on-background': {
      DEFAULT: 'rgb(var(--on-background-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-background-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-background-dark-rgb) / <alpha-value>)',
    },
    'surface-variant': {
      DEFAULT: 'rgb(var(--surface-variant-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-variant-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-variant-dark-rgb) / <alpha-value>)',
    },
    'on-surface-variant': {
      DEFAULT: 'rgb(var(--on-surface-variant-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-surface-variant-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-surface-variant-dark-rgb) / <alpha-value>)',
    },
    error: {
      DEFAULT: 'rgb(var(--error-rgb) / <alpha-value>)',
      light: 'rgb(var(--error-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--error-dark-rgb) / <alpha-value>)',
    },
    'on-error': {
      DEFAULT: 'rgb(var(--on-error-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-error-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-error-dark-rgb) / <alpha-value>)',
    },
    'error-container': {
      DEFAULT: 'rgb(var(--error-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--error-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--error-container-dark-rgb) / <alpha-value>)',
    },
    'on-error-container': {
      DEFAULT: 'rgb(var(--on-error-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-error-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-error-container-dark-rgb) / <alpha-value>)',
    },
    'inverse-primary': {
      DEFAULT: 'rgb(var(--inverse-primary-rgb) / <alpha-value>)',
      light: 'rgb(var(--inverse-primary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--inverse-primary-dark-rgb) / <alpha-value>)',
    },
    'on-inverse-primary': {
      DEFAULT: 'rgb(var(--on-inverse-primary-rgb) / <alpha-value>)',
      light: 'rgb(var(--on-inverse-primary-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--on-inverse-primary-dark-rgb) / <alpha-value>)',
    },
    outline: {
      DEFAULT: 'rgb(var(--outline-rgb) / <alpha-value>)',
      light: 'rgb(var(--outline-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--outline-dark-rgb) / <alpha-value>)',
    },
    'outline-variant': {
      DEFAULT: 'rgb(var(--outline-variant-rgb) / <alpha-value>)',
      light: 'rgb(var(--outline-variant-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--outline-variant-dark-rgb) / <alpha-value>)',
    },
    scrim: {
      DEFAULT: 'rgb(var(--scrim-rgb) / <alpha-value>)',
      light: 'rgb(var(--scrim-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--scrim-dark-rgb) / <alpha-value>)',
    },
    'surface-dim': {
      DEFAULT: 'rgb(var(--surface-dim-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-dim-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-dim-dark-rgb) / <alpha-value>)',
    },
    'surface-bright': {
      DEFAULT: `rgb(var(--surface-bright-rgb) / <alpha-value>)`,
      light: `rgb(var(--surface-bright-light-rgb) / <alpha-value>)`,
      dark: `rgb(var(--surface-bright-dark-rgb) / <alpha-value>)`,
    },
    'surface-container-lowest': {
      DEFAULT: 'rgb(var(--surface-container-lowest-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-container-lowest-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-container-lowest-dark-rgb) / <alpha-value>)',
    },
    'surface-container-low': {
      DEFAULT: 'rgb(var(--surface-container-low-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-container-low-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-container-low-dark-rgb) / <alpha-value>)',
    },
    'surface-container': {
      DEFAULT: 'rgb(var(--surface-container-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-container-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-container-dark-rgb) / <alpha-value>)',
    },
    'surface-container-high': {
      DEFAULT: 'rgb(var(--surface-container-high-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-container-high-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-container-high-dark-rgb) / <alpha-value>)',
    },
    'surface-container-highest': {
      DEFAULT: 'rgb(var(--surface-container-highest-rgb) / <alpha-value>)',
      light: 'rgb(var(--surface-container-highest-light-rgb) / <alpha-value>)',
      dark: 'rgb(var(--surface-container-highest-dark-rgb) / <alpha-value>)',
    },
    // Fixed colors
    'primary-fixed': 'rgb(var(--primary-fixed-rgb) / <alpha-value>)',
    'primary-fixed-dim': 'rgb(var(--primary-fixed-dim-rgb) / <alpha-value>)',
    'on-primary-fixed': 'rgb(var(--on-primary-fixed-rgb) / <alpha-value>)',
    'on-primary-fixed-variant': 'rgb(var(--on-primary-fixed-variant-rgb) / <alpha-value>)',
    'secondary-fixed': 'rgb(var(--secondary-fixed-rgb) / <alpha-value>)',
    'secondary-fixed-dim': 'rgb(var(--secondary-fixed-dim-rgb) / <alpha-value>)',
    'on-secondary-fixed': 'rgb(var(--on-secondary-fixed-rgb) / <alpha-value>)',
    'on-secondary-fixed-variant': 'rgb(var(--on-secondary-fixed-variant-rgb) / <alpha-value>)',
    'tertiary-fixed': 'rgb(var(--tertiary-fixed-rgb) / <alpha-value>)',
    'tertiary-fixed-dim': 'rgb(var(--tertiary-fixed-dim-rgb) / <alpha-value>)',
    'on-tertiary-fixed': 'rgb(var(--on-tertiary-fixed-rgb) / <alpha-value>)',
    'on-tertiary-fixed-variant': 'rgb(var(--on-tertiary-fixed-variant-rgb) / <alpha-value>)',
    // Surface elevation
    'surface-level-1': 'rgb(var(--primary-rgb) / 0.04)',
    'surface-level-2': 'rgb(var(--primary-rgb) / 0.08)',
    'surface-level-3': 'rgb(var(--primary-rgb) / 0.12)',
  },
};

export const materialColorPreset = (options: MaterialColorPluginOptions = { extend: false }) => {
  return {
    content: [],
    theme: {
      ...(options.extend ? {} : colorsConfig),
      extend: {
        ...(options.extend ? colorsConfig : {}),
      },
    },
    plugins: [materialColorsPlugin()],
  } satisfies Config;
};
