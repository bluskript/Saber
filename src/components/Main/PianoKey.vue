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
  @apply h-48 w-16 outline-none border-gray-500 cursor-pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.white {
  @apply bg-white;

  &.heldDown {
    @apply bg-gray-300;
  }
}

.black {
  @apply bg-black w-8 h-32 -ml-8 z-2;

  &.heldDown {
    @apply bg-dark-100;
  }
}

.offset {
  @apply -ml-4 border-x-2;
}
</style>
