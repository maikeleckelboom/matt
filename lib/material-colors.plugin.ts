import plugin from 'tailwindcss/plugin';

export const materialColorsPlugin = plugin(({ addBase, theme }) => {
  console.log('Hello from materialColorsPlugin');
  addBase({
    body: {
      background: 'rgb(var(--background-rgb))',
      color: 'rgb(var(--on-background-rgb))',
    },
  });
});
