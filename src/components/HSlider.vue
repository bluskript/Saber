<script lang="ts" setup>
import { defineEmit, defineProps } from '@vue/runtime-core'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: number
}>()
const emit = defineEmit(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
</script>

<template>
  <input
    v-model.number="model"
    type="range"
    class="slider"
  />
</template>

<style lang="postcss">
.slider {
  @apply appearance-none w-full h-1 bg-current text-blue-400;
}

.slider::-webkit-slider-thumb {
  @apply appearance-none bg-current w-4 h-4 cursor-pointer rounded-full transition-all duration-150;
  &:hover {
    @apply w-5 h-5 shadow-white shadow-sm;
  }
}
</style>
