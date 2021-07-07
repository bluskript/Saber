<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { computed, defineProps, onMounted } from '@vue/runtime-core'
import type { SynthFn } from '~/logic/synths'
import { SynthRenderer } from '~/logic/synthRenderer'
import TitleCard from '~/components/TitleCard.vue'

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
  <TitleCard class="flex flex-col">
    <template #header>
      <h1 class="w-full text-xl font-bold">
        Output Waveform
      </h1>
    </template>
    <canvas ref="canvas" class="w-full flex-1 max-h-50" />
  </TitleCard>
</template>
