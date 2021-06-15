<script setup lang="ts">
import { useHead } from '@vueuse/head'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Saber',
  meta: [
    { name: 'description', content: 'A toy synthesizer by Blusk' },
  ],
})
</script>

<template>
  <router-view />
</template>

<style lang="postcss">
html, body, #app {
  @apply w-full h-full;
}

#app {
  font-family: 'Roboto';
  @apply bg-light-50 text-black dark:bg-harmonydark-800 dark:text-white overflow-auto;
}
</style>
