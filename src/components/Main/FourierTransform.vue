<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import Card from '~/components/Card.vue'
import { FourierRenderer } from '~/logic/fourierRenderer'
import type { SynthFn } from '~/logic/synth'

const props = defineProps<{
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
    <span class="mb-2">Use your mouse to pan and zoom</span>
    <canvas ref="canvas" class="w-full h-100" />
  </Card>
</template>
