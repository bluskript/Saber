<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { computed, defineProps, onMounted } from '@vue/runtime-core'
import type { SynthFn } from '~/logic/synth'
import { SynthRenderer } from '~/logic/synthRenderer'

const props = defineProps<{
  fn?: SynthFn
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const drawHeight = ref(0.5)
const sampleSize = ref(8)

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
  <canvas ref="canvas" class="w-full" />
  <div class="flex mt-3 items-center">
    <span class="mr-2">Draw Height</span>
    <HSlider v-model="drawHeight" min="0" max="8" step="0.01" class="w-min" />
  </div>
  <div class="flex mt-3 items-center">
    <span class="mr-2">Sample Size</span>
    <HSlider v-model="sampleSize" min="6" max="12" step="1" class="w-min" />
  </div>
</template>
