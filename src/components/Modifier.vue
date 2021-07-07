<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { computed, defineEmit, defineProps, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
}>()
const emit = defineEmit(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)

const displayValue = computed(() => (props.step || 1) < 1 ? model.value.toFixed(2) : model.value)

const dragging = ref(false)

const onMove = (e: MouseEvent) => {
  if (!dragging.value) return
  if (e.movementY < 0)
    model.value += props.step || 1
  else if (e.movementY > 0)
    model.value -= props.step || 1
}

const onMouseUp = () => dragging.value = false

watch(dragging, () => {
  if (dragging.value) {
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onMouseUp)
  }
  else {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
})
</script>

<template>
  <div class="modifier" @mousedown="dragging = true" @mouseup="dragging = false" @mousemove="onMove">
    <div class="bg-harmonydark-900 p-1">
      {{ props.label }}
    </div>
    <div class="bg-harmonydark-800 p-1 text-primary-400">
      {{ Math.sign(model) >= 0 ? '+' : null }}{{ displayValue }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.modifier {
  @apply select-none transition duration-100 border-2 border-transparent flex rounded-0.5rem w-min overflow-hidden font-bold text-sabertext;
  cursor: ns-resize;

  &:active, &:focus {
    @apply border-2 border-primary-400;
  }
}
</style>
