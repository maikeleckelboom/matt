<script lang="ts" setup>
import {
  argbFromHex,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeContent,
} from '@material/material-color-utilities';

const mainColor = '#3f51b5';

const isDark = true;
const contrastLevel = 0.3;
const argb = argbFromHex(mainColor);
const source = Hct.fromInt(argb);
const dynamicScheme = new SchemeContent(source, isDark, contrastLevel);

const dynamicSchemeContent = computed(() =>
  Object.keys(MaterialDynamicColors)
    .filter((key) => key !== 'contentAccentToneDelta')
    .reduce((acc, key) => {
      const color = (
        MaterialDynamicColors[key as keyof Omit<MaterialDynamicColors, 'contentAccentToneDelta'>] as any
      ).getArgb(dynamicScheme);
      return { ...acc, [key]: hexFromArgb(color) };
    }, {}),
);
</script>

<template>
  <div class="grid grid-cols-6">
    <div v-for="(color, key, index) in dynamicSchemeContent" :key="index">
      {{ key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) }}
      <div :style="{ backgroundColor: color }" class="h-12 w-12 rounded" />
      <span>{{ color }}</span>
    </div>
  </div>
</template>
