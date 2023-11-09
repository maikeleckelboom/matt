<script lang="ts" setup>
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '~/tailwind.config';
import type { Config } from 'tailwindcss';

const resolvedConfig: Config = resolveConfig(tailwindConfig) satisfies Config;
</script>

<template>
  <div>
    <pre>{{ JSON.stringify(resolvedConfig, null, 2) }}</pre>
  </div>
</template>
