<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { computed, defineProps, onMounted } from '@vue/runtime-core'
import type { SynthFn } from '~/logic/synths'
import { SynthRenderer } from '~/logic/synthRenderer'

const props = defineProps<{
  fn?: SynthFn
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const drawHeight = ref(1.2)
const sampleSize = ref(10)

const fn = computed(() => props.fn)
const actualSampleSize = computed(() => Math.pow(2, sampleSize.value))

onMounted(() => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (ctx === null) return
  const renderer = new SynthRenderer(ctx, fn, drawHeight, actualSampleSize)
})
</script>

<template>
  <Card class="flex flex-col">
    <canvas ref="canvas" class="w-full flex-1" />
    <HSlider
      v-model="drawHeight"
      label="Draw Height"
      min="0"
      max="8"
      step="0.01"
    />
    <HSlider
      v-model="sampleSize"
      label="Sample Size"
      min="6"
      max="12"
      step="1"
    />
  </Card>
</template>
