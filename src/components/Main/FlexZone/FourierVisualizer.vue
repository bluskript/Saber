<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import TitleCard from '~/components/TitleCard.vue'
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

const fullscreen = ref(false)

onMounted(() => {
  if (!visualizerCanvas.value) return
  const ctx = visualizerCanvas.value.getContext('2d')
  if (ctx === null) return
  const visualizer = new FourierVisualizer(ctx, drawScale, fourierArr)
})
</script>

<template>
  <TitleCard class="flex flex-col flex-1 transition-all duration-200" :class="{ fullscreen }">
    <template #header>
      <h1 class="w-full text-xl font-bold">
        FFT
      </h1>
      <HBtn variant="text" icon dense @click="fullscreen = !fullscreen">
        <mdi-fullscreen class="text-xl" />
      </HBtn>
    </template>
    <canvas ref="visualizerCanvas" class="flex-1" />
  </TitleCard>
</template>

<style lang="postcss" scoped>
.fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
