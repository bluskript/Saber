<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import Card from '~/components/Card.vue'
import { FourierRenderer } from '~/logic/fourierRenderer'
import type { SynthFn } from '~/logic/synth'

const props = defineProps<{
  setSynthFn: (fn: SynthFn) => void
  synthFn?: SynthFn
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const drawScale = ref(1)

const fn = computed(() => props.synthFn)

onMounted(() => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (ctx === null) return
  const renderer = new FourierRenderer(ctx, fn, drawScale)
})
</script>

<template>
  <Card>
    <h2 class="text-xl mb-3">
      Exploration with Fast Fourier Transform
    </h2>
    <label class="text-sm">Draw Size</label>
    <HSlider v-model="drawScale" class="mb-6" min="0" max="32" step="1" />
    <canvas ref="canvas" class="w-full" />
  </Card>
</template>
