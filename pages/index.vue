<script lang="ts" setup>
import {
  argbFromHex,
  Blend,
  hexFromArgb,
  rgbaFromArgb,
  type Theme,
  themeFromImage,
  themeFromSourceColor,
  TonalPalette,
} from '@material/material-color-utilities';

import {
  type PaletteKeyColor,
  propertiesFromTheme,
  type ThemeConfig,
  TONES_DEFAULT,
} from '~/utils/propertiesFromTheme';
import type { Ref } from 'vue';

const config = reactive<ThemeConfig>({
  source: '#0088F0',
  dark: false,
  customColors: [
    {
      name: 'Cold Cyan',
      value: '#2DE2E6',
      blend: true,
    },
  ],
  properties: [
    {
      prefix: 'tw-',
      suffix: '-rgb',
      subset: ['scheme'],
      transform: (argb: number) => {
        const { r, g, b } = rgbaFromArgb(argb);
        return `${r} ${g} ${b}`;
      },
    },
  ],
  experimental_source_image: 'http://localhost:3000/_nuxt/assets/source.jpg',
});

const createTheme = () => {
  if (isRemoteDataURL(config.source)) {
    throw new Error(
      "Please use 'experimental_source_image' instead of a remote data URL for the 'source' in the configuration",
    );
    return;
  }

  if (!isValidColorHex(config.source)) {
    throw new Error('Invalid color. Please use a valid hex color.');
    return;
  }

  console.log('GETTING THEME FROM SOURCE COLOR');

  return themeFromSourceColor(
    argbFromHex(config.source),
    config.customColors?.map((color) => ({
      name: color.name,
      value: argbFromHex(color.value),
      blend: color.blend,
    })),
  );
};

const theme = ref(createTheme()) as Ref<Theme>;

watch(
  [() => config.source, () => config.customColors],
  ([_a, _b]) => {
    theme.value = createTheme() as Theme;
  },
  { deep: true },
);

const textContent = computed(() => (theme.value ? propertiesFromTheme(theme.value, config) : {}));

useHead({
  style: [
    {
      textContent: computed(() =>
        Object.entries(textContent.value)
          .map(([name, value]) => `${name}: ${value};`)
          .join(''),
      ),
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

const keyColorPalettes = computed(() => {
  if (!theme.value) return [];
  const { palettes } = JSON.parse(JSON.stringify(theme.value, null, 2));
  return Object.keys(palettes).reduce((acc, name) => {
    const palette = palettes[name as keyof typeof palettes];
    acc.push({ name, ...palette.keyColor });
    return acc;
  }, [] as PaletteKeyColor[]);
});

/**
 * EXPERIMENTAL_SOURCE_IMAGE
 */
onMounted(async () => {
  if (!config?.experimental_source_image || !isRemoteDataURL(config.experimental_source_image)) return;
  const time = new Date().getTime();
  const image = document.createElement('img');
  image.src = config.experimental_source_image;
  image.crossOrigin = 'anonymous';
  image.onload = async () => {
    const themeDefinition = await themeFromImage(image);
    console.log('Experimental theme from image', themeDefinition, new Date().getTime() - time);
  };
});
</script>

<template>
  <div>
    <div v-if="theme">
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
  </div>
</template>
