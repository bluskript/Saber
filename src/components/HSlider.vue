<script lang="ts" setup>
import { defineEmit, defineProps } from '@vue/runtime-core'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: number
  min?: string
  max?: string
  step?: string
  label?: string
}>()
const emit = defineEmit(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="flex items-center">
    <span class="mr-3 text-gray-600 dark:text-gray-300">{{ props.label }}</span>
    <input
      v-model.number="model"
      type="range"
      class="slider"
      :min="props.min"
      :max="props.max"
      :step="props.step"
    />
    <span class="ml-2">{{ model }}</span>
  </div>
</template>

<style lang="postcss">
.slider {
  @apply appearance-none h-1 bg-current text-blue-400 flex-1;
}

.slider::-webkit-slider-thumb {
  @apply appearance-none bg-current w-4 h-4 cursor-pointer rounded-full transition-all duration-150;
  &:hover {
    @apply w-5 h-5 shadow-white shadow-sm;
  }
}
</style>
