<script lang="ts" setup></script>

<template>
  <div class="max-w-[1200px] mx-auto w-full px-4">
    <ul class="flex my-4">
      <li class="mr-6">
        <NuxtLink to="/">Package</NuxtLink>
      </li>
      <li class="mr-6">
        <NuxtLink to="/dynamic">Dynamic</NuxtLink>
      </li>
      <li class="mr-6">
        <NuxtLink to="/tailwind">Tailwindcss</NuxtLink>
      </li>
    </ul>
    <NuxtPage />
  </div>
</template>
