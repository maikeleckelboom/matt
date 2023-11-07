<script lang="ts" setup>
import {
  argbFromHex,
  Blend,
  hexFromArgb,
  labFromArgb,
  rgbaFromArgb,
  type Theme,
  themeFromSourceColor,
  TonalPalette,
} from '@material/material-color-utilities';

import {
  cssVarsFromTheme,
  type KeyColorPalette,
  type ThemeConfig,
  TONES_DEFAULT,
} from '~/utils/propertiesFromTheme';
import type { Ref } from 'vue';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwindcss/defaultConfig';

const imagePath = '../assets/source.png';

const config = reactive<ThemeConfig>({
  source: '#ff00d2',
  dark: false,
  customColors: [
    {
      name: 'Cool Blue',
      value: '#0088F0',
      blend: true,
    },
  ],
  properties: [
    {
      prefix: 'tw-',
      suffix: '-rgb',
      subset: ['scheme', 'scheme.light', 'scheme.dark'],
      transform: (argb: number) => {
        const { r, g, b } = rgbaFromArgb(argb);
        return `${r} ${g} ${b}`;
      },
    },
    {
      prefix: 'lib-',
      suffix: '-lab',
      transform: (argb: number) => {
        const [l, a, b] = labFromArgb(argb);
        return `lab(${l} ${a} ${b})`;
      },
    },
  ],
});

const createThemeFromConfig = () => {
  return themeFromSourceColor(
    argbFromHex(config.source),
    config.customColors.map((color) => ({
      name: color.name,
      value: argbFromHex(color.value),
      blend: color.blend,
    })),
  );
};

watch(
  [() => config.source, () => config.customColors],
  ([_a, _b]) => {
    theme.value = createThemeFromConfig();
  },
  { deep: true },
);

const theme = ref(createThemeFromConfig()) as Ref<Theme>;

const keyColorPalettes = computed(() => {
  const { palettes } = JSON.parse(JSON.stringify(theme.value, null, 2));
  return Object.keys(palettes).reduce((acc, name) => {
    const palette = palettes[name as keyof typeof palettes];
    acc.push({ name, ...palette.keyColor });
    return acc;
  }, [] as KeyColorPalette[]);
});

const textContent = computed(() => {
  const generated = cssVarsFromTheme(theme.value, config);
  return Object.entries(generated)
    .map(([name, value]) => `${name}: ${value};`)
    .join('');
});

useHead({
  style: [
    {
      textContent: textContent.value,
    },
  ],
});

const getBackgroundColor = (color: string, tone: (typeof TONES_DEFAULT)[number], blend?: boolean) => {
  if (blend) {
    return hexFromArgb(
      Blend.harmonize(TonalPalette.fromInt(argbFromHex(color)).tone(tone), argbFromHex(config.source)),
    );
  }
  return hexFromArgb(TonalPalette.fromInt(argbFromHex(color)).tone(tone));
};
</script>

<template>
  <div>
    <h1 class="text-secondary font-semibold text-2xl">Material Color Utilities Wrapper</h1>
    <div
      :style="{
        backgroundColor: `rgb(var(--tw-secondary-rgb))`,
      }"
      class="h-12 w-12"
    ></div>
    <div class="grid grid-cols-1">
      <div>
        <form>
          <div class="flex flex-col">
            <label for="source">Source Color</label>
            <input id="source" v-model="config.source" type="color" />
          </div>
          <div class="flex flex-col">
            <label for="dark">Dark Mode</label>
            <input id="dark" v-model="config.dark" type="checkbox" />
          </div>
          <div>
            <pre>{{ textContent }}</pre>
          </div>
          <div class="flex flex-col">
            <label for="customColors">Custom Colors</label>
            <div id="customColors">
              <div v-for="(color, index) in config.customColors" :key="index">
                <input v-model="color.name" type="text" />
                <input v-model="color.value" type="color" />
                <input v-model="color.blend" type="checkbox" />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div>
        <div v-for="(keyColor, i) in keyColorPalettes" :key="i">
          <pre>{{ keyColor }}</pre>
          <div class="flex">
            <div :style="{ backgroundColor: hexFromArgb(keyColor.argb) }" class="h-12 w-12 rounded" />
            <div
              v-for="tone in TONES_DEFAULT"
              :style="{
                backgroundColor: hexFromArgb(TonalPalette.fromInt(keyColor.argb).tone(tone)),
              }"
              class="h-12 w-12 rounded"
            >
              <span class="invisible">{{ tone }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div v-for="(customColor, i) in config.customColors" :key="i" class="flex flex-col">
          <pre>{{ theme.customColors.find((item) => item.color.name === customColor.name) }}</pre>
          <div class="flex">
            <div :style="{ backgroundColor: customColor.value }" class="h-12 w-12 rounded" />
            <div
              v-for="tone in TONES_DEFAULT"
              :style="{
                backgroundColor: getBackgroundColor(customColor.value, tone, customColor.blend),
              }"
              class="h-12 w-12 rounded"
            >
              <span class="invisible">{{ tone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
