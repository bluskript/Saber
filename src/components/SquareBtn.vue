<script lang="ts" setup>
import { defineProps } from '@vue/runtime-core'

defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div v-wave :class="{ active }" class="btn">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.btn {
  @apply transition duration-200 cursor-pointer border-2 flex items-center rounded w-min p-2;

  &:not(.active) {
    @apply text-secondary-300 border-transparent;
  }
}

.active {
  @apply bg-primary-100 border-primary-400 text-primary-400;
}
</style>
