<script lang="ts" setup>
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwindcss/defaultConfig';

const resolvedConfig = resolveConfig(tailwindConfig);

const tailwindColors = computed(() => {
  const colors = resolvedConfig.theme?.colors ?? {};
  return Object.keys(colors).reduce(
    (acc, name) => {
      const color = colors[name as keyof typeof colors];
      if (typeof color === 'string') {
        acc.push({ name, value: color });
      } else {
        Object.keys(color).forEach((shade) => {
          acc.push({
            name: `${name}-${shade}`,
            value: color[shade as keyof typeof color] as string,
          });
        });
      }
      return acc;
    },
    [] as { name: string; value: string }[],
  );
});
</script>

<template>
  <div></div>
</template>
