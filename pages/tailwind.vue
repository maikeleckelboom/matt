<script lang="ts" setup>
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '~/tailwind.config';
import type { Config } from 'tailwindcss';

const resolvedConfig: Config = resolveConfig(tailwindConfig) satisfies Config;

const tailwindColors = computed(() => {
  const colors = resolvedConfig.theme?.colors ?? {};
  return Object.keys(colors).reduce(
    (acc, name) => {
      const color = colors[name as keyof typeof colors];
      Object.keys(color).forEach((shade) => {
        acc.push({
          name: `${name}-${shade}`,
          value: color[shade as keyof typeof color] as string,
        });
      });
      return acc;
    },
    [] as { name: string; value: string }[],
  );
});
</script>

<template>
  <div>
    <pre>{{ JSON.stringify(tailwindColors, null, 2) }}</pre>
  </div>
</template>
