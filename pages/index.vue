<script lang="ts" setup>
import {
  argbFromHex,
  Blend,
  type CustomColor,
  hexFromArgb,
  rgbaFromArgb,
  type Theme,
  themeFromSourceColor,
  TonalPalette,
} from '@material/material-color-utilities';

import type { Ref } from 'vue';

import { textFromProperties, propertiesFromTheme } from '~/lib/package/material-properties';
import type { ThemePropertiesConfig } from '~/lib/package/types';
import { PALETTE_TONES_DEFAULT } from '~/lib/package/constants';

type CustomColorHex = Omit<CustomColor, 'value'> & { value: string };

type ThemeConfig = {
  source: string;
  customColors: CustomColorHex[];
};

const themeConfig = reactive<ThemeConfig>({
  source: '#ffb700',
  customColors: [
    {
      name: 'Cool Blue',
      value: '#0088F0',
      blend: true,
    },
    {
      name: 'Pinky Blink',
      value: '#FF00D2',
      blend: true,
    },
  ],
});

const createThemeFromSource = () =>
  themeFromSourceColor(
    argbFromHex(themeConfig.source),
    themeConfig.customColors.map((color) => ({
      name: color.name,
      value: argbFromHex(color.value),
      blend: color.blend,
    })),
  );

watch(
  [() => themeConfig.source, () => themeConfig.customColors],
  ([_a, _b]) => {
    theme.value = createThemeFromSource();
  },
  { deep: true },
);

const theme = ref(createThemeFromSource()) as Ref<Theme>;

const propertiesConfig = reactive<ThemePropertiesConfig>({
  isDark: true,
  properties: [
    {
      suffix: '-rgb',
      subset: ['scheme', 'scheme.light', 'scheme.dark'],
      transform: (argb: number) => {
        const { r, g, b } = rgbaFromArgb(argb);
        return `${r} ${g} ${b}`;
      },
    },
  ],
});

const properties = computed(() => propertiesFromTheme(theme.value, propertiesConfig));

const textContent = computed(() => textFromProperties(properties.value));

useHead({
  style: [
    {
      textContent: computed(() => `:root { ${textContent.value} }`),
    },
  ],
});

const getBackgroundColor = (color: string, tone: number, blend?: boolean) => {
  if (blend) {
    return hexFromArgb(
      Blend.harmonize(TonalPalette.fromInt(argbFromHex(color)).tone(tone), argbFromHex(themeConfig.source)),
    );
  }
  return hexFromArgb(TonalPalette.fromInt(argbFromHex(color)).tone(tone));
};

type KeyColorPalette = { name: string } & TonalPalette['keyColor'];

const keyColorPalettes = computed(() => {
  const { palettes } = JSON.parse(JSON.stringify(theme.value, null, 2));
  return Object.keys(palettes).reduce((acc, name) => {
    const palette = palettes[name as keyof typeof palettes];
    acc.push({ name, ...palette.keyColor });
    return acc;
  }, [] as KeyColorPalette[]);
});

const findCustomColorByName = (name: string) =>
  theme.value.customColors.find((item) => item.color.name === name);
</script>

<template>
  <div>
    <h1 class="text-secondary font-semibold text-2xl mb-6">Material Color Utilities Wrapper</h1>
    <div class="grid grid-cols-2">
      <div>
        <form class="w-fit bg-surface-level-1 text-on-surface flex flex-col p-4 rounded-xl gap-2">
          <div class="flex justify-between">
            <label for="dark">Dark Mode</label>
            <input id="dark" v-model="propertiesConfig.isDark" type="checkbox" />
          </div>
          <div class="flex justify-between">
            <label for="source">Primary <span class="text-sm ml-1">(source color)</span></label>
            <input id="source" v-model="themeConfig.source" type="color" />
          </div>
          <div class="flex flex-col">
            <label class="mb-1" for="customColors">Custom Colors</label>
            <div class="flex flex-col items-center gap-2">
              <div
                v-for="(color, index) in themeConfig.customColors"
                :key="index"
                class="flex items-center gap-2"
              >
                <input v-model="color.name" class="bg-surface p-2" type="text" />
                <input v-model="color.value" type="color" />
                <input v-model="color.blend" type="checkbox" />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div>
        <div v-for="(keyColor, i) in keyColorPalettes" :key="i" class="flex flex-col">
          <div class="flex flex-row">
            <div :style="{ backgroundColor: hexFromArgb(keyColor.argb) }" class="fh-12 w-12 rounded" />
            <div
              v-for="tone in PALETTE_TONES_DEFAULT"
              :style="{
                backgroundColor: hexFromArgb(TonalPalette.fromInt(keyColor.argb).tone(tone)),
              }"
              class="h-12 w-12 rounded"
            ></div>
          </div>
        </div>
        <div v-for="(customColor, i) in themeConfig.customColors" :key="i" class="flex flex-col">
          <div class="flex">
            <div :style="{ backgroundColor: customColor.value }" class="h-12 w-12 rounded" />
            <div
              v-for="tone in PALETTE_TONES_DEFAULT"
              :style="{
                backgroundColor: getBackgroundColor(customColor.value, tone, customColor.blend),
              }"
              class="h-12 w-12 rounded"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
