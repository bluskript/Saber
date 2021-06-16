<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import Card from '~/components/Card.vue'
import { Complex } from '~/logic/fft'
import { FourierRenderer as FourierVisualizer } from '~/logic/fourierVisualizer'
import type { SynthFn } from '~/logic/synths'

const props = defineProps<{
  synthFn?: SynthFn
  fourierArr: Complex[]
}>()

const fourierArr = computed(() => props.fourierArr)

const visualizerCanvas = ref<HTMLCanvasElement | null>(null)

const drawScale = ref(1)

onMounted(() => {
  if (!visualizerCanvas.value) return
  const ctx = visualizerCanvas.value.getContext('2d')
  if (ctx === null) return
  const visualizer = new FourierVisualizer(ctx, drawScale, fourierArr)
})
</script>

<template>
  <Card class="flex flex-col">
    <h1 class="text-xl mb-1">
      Fourier Transform Visualizer
    </h1>
    <p class="mb-2">
      Use your mouse to pan and zoom
    </p>
    <canvas ref="visualizerCanvas" class="w-full flex-1" />
  </Card>
</template>
