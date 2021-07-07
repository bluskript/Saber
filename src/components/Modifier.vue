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
  percent: {
    type: Boolean,
    default: false,
  },
  default: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmit(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
const dragging = ref(false)
let startY = 0
let initialValue = 0

const displayValue = computed(() => {
  if (props.percent)
    return `${(model.value * 100).toFixed(0)}%`

  return props.step < 1 ? model.value.toFixed(2) : model.value
})

// Sets model to 0 if alt is held. Otherwise sets dragging to true.
const onMouseDown = (e: MouseEvent) => {
  if (e.altKey) {
    model.value = props.default
  }
  else {
    dragging.value = true
    startY = e.clientY
    initialValue = model.value
  }
}

const roundNearestStep = (value: number) => {
  return Math.ceil(value / props.step) * props.step
}

const onMove = (e: MouseEvent) => {
  if (!dragging.value) return
  const scale = props.max - props.min
  const distance = startY - e.clientY
  const val = ((distance * scale) / 200)
  model.value = Math.min(
    Math.max(
      initialValue + roundNearestStep(val),
      props.min,
    ),
    props.max,
  )
}

const onMouseUp = () => {
  dragging.value = false
  startY = model.value
}

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
  <div class="modifier text-sm" @mousedown.passive="onMouseDown" @mouseup.passive="dragging = false">
    <div class="bg-harmonydark-900 py-0.5 px-1">
      {{ props.label }}
    </div>
    <div class="bg-harmonydark-800 py-0.5 px-1 min-w-12 text-right text-primary-400">
      {{ Math.sign(model) >= 0 ? '+' : null }}{{ displayValue }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.modifier {
  @apply select-none transition duration-100 border-2 border-transparent flex rounded-0.5rem overflow-hidden font-bold text-sabertext;
  cursor: ns-resize;

  &:active, &:focus {
    @apply border-2 border-primary-400;
  }
}
</style>
