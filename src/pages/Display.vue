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
const sampleSize = ref(256)
let renderer: SynthRenderer | undefined

const fn = computed(() => props.fn)

onMounted(() => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (ctx === null) return
  renderer = new SynthRenderer(ctx, fn, drawHeight, sampleSize)
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
    <HSlider v-model="sampleSize" min="128" max="4096" step="32" class="w-min" />
  </div>
</template>
