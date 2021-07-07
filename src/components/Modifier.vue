<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { computed, defineEmit, defineProps, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  label: {
    type: String,
    default: 'CRING',
  },
})
const emit = defineEmit(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
let tmpModel = model.value
const dragging = ref(false)

const displayValue = computed(() => (props.step || 1) < 1 ? model.value.toFixed(2) : model.value)

// Sets model to 0 if alt is held. Otherwise sets dragging to true.
const onMouseDown = (e: MouseEvent) => {
  if (e.altKey)
    model.value = 0

  else
    dragging.value = true
}

const roundNearestStep = (value: number) => {
  return Math.round(value / props.step) * props.step
}

const onMove = (e: MouseEvent) => {
  if (!dragging.value) return
  const scale = props.max - props.min
  // uses the movementY and the scale to calculate the value delta
  const delta = (e.movementY / 100) * scale
  if (e.movementY < 0 && model.value < props.max)
    tmpModel -= delta
  else if (e.movementY > 0 && model.value > props.min)
    tmpModel -= delta
  model.value = roundNearestStep(tmpModel)
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
  <div class="modifier" @mousedown.passive="onMouseDown" @mouseup.passive="dragging = false">
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
