import plugin from 'tailwindcss/plugin';

type MaterialColorPluginOptions = {};

export const materialColorsPlugin = (options?: MaterialColorPluginOptions) => {
  return plugin(({ addBase, theme }) => {
    addBase({
      html: {
        background: 'rgb(var(--background-rgb))',
        color: 'rgb(var(--on-background-rgb))',
        fontFamily: theme('fontFamily.sans'),
      },
    });
  });
};
