<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import Card from '~/components/Card.vue'
import { FourierRenderer as FourierVisualizer } from '~/logic/fourierVisualizer'
import { FrequencyViewer } from '~/logic/frequencyViewer'
import type { SynthFn } from '~/logic/synths'
import { useFourier } from '~/logic/useFourier'

const props = defineProps<{
  synthFn?: SynthFn
}>()

const visualizerCanvas = ref<HTMLCanvasElement | null>(null)
const viewerCanvas = ref<HTMLCanvasElement | null>(null)
const drawScale = ref(1)
const sampleSize = ref(11)
const actualSampleSize = computed(() => Math.pow(2, sampleSize.value))

const fn = computed(() => props.synthFn)

const fourierArr = useFourier(fn, actualSampleSize)

onMounted(() => {
  if (!visualizerCanvas.value || !viewerCanvas.value) return
  const ctx = visualizerCanvas.value.getContext('2d')
  const viewerCtx = viewerCanvas.value.getContext('2d')
  if (ctx === null) return
  const visualizer = new FourierVisualizer(ctx, drawScale, fourierArr)
  const viewer = new FrequencyViewer(viewerCtx, fourierArr)
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
    <HSlider v-model="sampleSize" max="20" min="6" step="1" />
    <canvas ref="visualizerCanvas" class="w-full flex-1" />
    <canvas ref="viewerCanvas" class="w-full flex-1" />
  </Card>
</template>
