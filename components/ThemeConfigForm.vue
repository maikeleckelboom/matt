<script lang="ts" setup>
const testRef = ref('test');

const test = () => {
  console.log(testRef.value);
};

onMounted(() => {
  console.log('mounted');
});
</script>

<template>
  <div>
    <button @click="test">test</button>
  </div>
</template>

<style></style>
