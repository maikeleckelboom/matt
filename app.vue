<script lang="ts" setup>
import {
  argbFromHex,
  Blend,
  hexFromArgb,
  rgbaFromArgb,
  type Theme,
  themeFromSourceColor,
  TonalPalette,
} from '@material/material-color-utilities';
import { cssVarsFromTheme, type ThemeConfig, TONES_DEFAULT } from '~/utils/propertiesFromTheme';

const config = reactive<ThemeConfig>({
  primary: '#0088F0',
  customColors: [
    {
      name: 'Canary Yellow',
      value: '#eeff00',
      blend: false,
    },
  ],
  options: {
    dark: true,
  },
  properties: [
    {
      prefix: '',
      suffix: '-rgb',
      includes: ['light', 'dark'],
      transformFn: (argb: number) => {
        const { r, g, b } = rgbaFromArgb(argb);
        return `${r} ${g} ${b}`;
      },
    },
    {
      transformFn: (argb: number) => hexFromArgb(argb),
    },
  ],
});

const createThemeFromConfig = () =>
  themeFromSourceColor(
    argbFromHex(config.primary),
    config.customColors.map((color) => ({
      name: color.name,
      value: argbFromHex(color.value),
      blend: color.blend,
    })),
  );

const theme = ref<Theme>(createThemeFromConfig());

type KeyColorPalette = {
  name: string;
  argb: number;
  hue: number;
  chroma: number;
  tone: number;
};

const keyColorPalettes = computed(() => {
  const { palettes } = JSON.parse(JSON.stringify(theme.value, null, 2));
  return Object.keys(palettes).reduce((acc, name) => {
    const palette = palettes[name as keyof typeof palettes];
    acc.push({
      name,
      argb: palette.keyColor.argb,
      hue: palette.keyColor.internalHue,
      chroma: palette.keyColor.internalChroma,
      tone: palette.keyColor.internalTone,
    });
    return acc;
  }, [] as KeyColorPalette[]);
});

watch(
  [() => config.primary, () => config.customColors],
  ([_s, _cc]) => {
    theme.value = createThemeFromConfig();
  },
  { deep: true },
);

useHead({
  style: [
    {
      textContent: computed(() => {
        const props = cssVarsFromTheme(theme.value as Theme, config);
        console.log({ props });
        return `:root {${Object.entries(props)
          .map(([name, value]) => `${name}: ${value};`)
          .join('')}}`;
      }),
    },
  ],
});

const getBackgroundColor = (color: string, tone: (typeof TONES_DEFAULT)[number], blend?: boolean) => {
  if (blend) {
    return hexFromArgb(
      Blend.harmonize(TonalPalette.fromInt(argbFromHex(color)).tone(tone), argbFromHex(config.primary)),
    );
  }
  return hexFromArgb(TonalPalette.fromInt(argbFromHex(color)).tone(tone));
};
</script>

<template>
  <div>
    <h1 class="text-secondary font-semibold text-2xl">Material Color Utilities Wrapper</h1>
    <div class="h-12 w-12 bg-[--primary]"></div>
    <div class="grid grid-cols-1">
      <div>
        <form>
          <div class="flex flex-col">
            <label for="source">Source Color</label>
            <input id="source" v-model="config.primary" type="color" />
          </div>
          <div class="flex flex-col">
            <label for="dark">Dark Mode</label>
            <input id="dark" v-model="config.options.dark" type="checkbox" />
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
