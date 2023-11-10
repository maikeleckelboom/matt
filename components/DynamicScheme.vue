<script lang="ts" setup>
import {
  argbFromHex,
  Hct,
  hexFromArgb,
  rgbaFromArgb,
  SchemeContent,
} from '@material/material-color-utilities';
import {
  colorsFromSchemeContent,
  propertiesFromScheneContent,
  textFromProperties,
} from '~/lib/src/material-properties';

const props = defineProps<{
  source: string;
  isDark: boolean;
  contrastLevel: number;
}>();

const dynamicSchemeContent = computed(
  () => new SchemeContent(Hct.fromInt(argbFromHex(props.source)), props.isDark, props.contrastLevel),
);
const schemeContent = computed(() => colorsFromSchemeContent(dynamicSchemeContent.value));

const properties = computed(() =>
  propertiesFromScheneContent(dynamicSchemeContent.value, {
    suffix: '-rgb',
    prefix: '',
    transform: (argb: number) => {
      const { r, g, b } = rgbaFromArgb(argb);
      return `${r} ${g} ${b}`;
    },
  }),
);

const textContent = computed(() => textFromProperties([properties.value]));

useHead({
  style: [
    {
      textContent: computed(() => `:root { ${textContent.value} }`),
    },
  ],
});
</script>

<template>
  <div class="bg-surface-level-1 p-4">
    <div class="grid grid-cols-6">
      <div v-for="(color, key, index) in schemeContent" :key="index">
        {{ key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) }}
        <div :style="{ backgroundColor: hexFromArgb(color) }" class="h-12 w-12 rounded" />
      </div>
    </div>
  </div>
</template>
