<script lang="ts" setup>
const config = reactive({
  source: '#d22020',
  contrastLevel: 0.3,
  isDark: true,
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <form class="w-fit bg-surface-level-1 text-on-surface flex flex-col p-4 gap-2">
      <div class="flex justify-between">
        <label class="flex items-center gap-4" for="dark">
          <span>Dark Mode</span>
          <input id="dark" v-model="config.isDark" type="checkbox" />
        </label>
      </div>
      <div class="flex justify-between">
        <label for="source">Primary <span class="text-sm ml-1">(source color)</span></label>
        <input id="source" v-model="config.source" type="color" />
      </div>
      <div class="flex justify-between">
        <label for="contrastLevel">Contrast Level</label>
        <input
          id="contrastLevel"
          v-model.number="config.contrastLevel"
          max="1"
          min="0"
          step="0.1"
          type="range"
        />
      </div>
    </form>
    <div class="">
      <DynamicScheme
        :contrastLevel="config.contrastLevel"
        :isDark="config.isDark"
        :source="config.source"
        class="col-start-2 col-end-6"
      />
    </div>
  </div>
</template>
