<script lang="ts" setup>
import { computed, defineProps } from '@vue/runtime-core'
const props = defineProps<{
  black?: boolean
  offset?: boolean
  heldDown?: boolean
}>()

const keyProps = computed(() => ({
  key: true,
  black: props.black,
  white: !props.black,
  offset: props.offset,
  heldDown: props.heldDown,
}))
</script>

<template>
  <a :class="keyProps" />
</template>

<style lang="postcss" scoped>
.key {
  @apply h-full w-16 outline-none border-gray-500 dark:border-harmonydark-900 cursor-pointer flex-shrink-0;
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.white {
  @apply bg-white dark:bg-harmonydark-300;

  &.heldDown {
    @apply bg-gray-300 dark:bg-primary-300;
  }
}

.black {
  @apply bg-black dark:bg-harmonydark-900 w-8 h-24 -ml-8 z-2;

  &.heldDown {
    @apply bg-dark-100 dark:bg-primary-200;
  }
}

.offset {
  @apply -ml-4 border-x-2;
}
</style>
