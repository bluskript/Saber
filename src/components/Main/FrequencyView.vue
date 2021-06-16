<script lang="ts" setup>
import { computed, defineProps } from '@vue/runtime-core'
import { onMounted, ref } from 'vue'
import { Complex } from '~/logic/fft'
import { FrequencyViewer } from '~/logic/frequencyViewer'

const props = defineProps<{
  fourierArr: Complex[]
}>()
const fourierArr = computed(() => props.fourierArr)

const viewerCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!viewerCanvas.value) return
  const ctx = viewerCanvas.value.getContext('2d')
  if (ctx === null) return
  const viewer = new FrequencyViewer(ctx, fourierArr)
})
</script>

<template>
  <Card class="flex flex-col">
    <canvas ref="viewerCanvas" class="w-full flex-1 max-h-50" />
  </Card>
</template>
