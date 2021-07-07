<script lang="ts" setup>
</script>

<template>
  <div class="bg-harmonydark-850 rounded p-3 w-full flex flex-col gap-2">
    <div class="p-3 bg-harmonydark-700 font-bold rounded flex items-center justify-between">
      <slot name="title"></slot>
    </div>
    <slot />
  </div>
</template>
