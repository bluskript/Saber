<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import AudioBufferTest from './AudioBufferTest.vue'
import FourierTransform from './FourierTransform.vue'
import type { SynthFn } from '~/logic/synth'

const ctx = new AudioContext()
const synthFn = ref<SynthFn | undefined>(undefined)
let position = 0

onMounted(async() => {
  const processor = ctx.createScriptProcessor(512, 0, 1)
  processor.addEventListener('audioprocess', (ev) => {
    const outputBuffer = ev.outputBuffer
    const targetChannel = outputBuffer.getChannelData(0)
    synthFn.value?.(targetChannel, position, ctx.sampleRate)
    position += outputBuffer.length
  })
  processor.connect(ctx.destination)
})

const setSynthFn = (fn: SynthFn) => {
  synthFn.value = fn
}
</script>

<template>
  <div class="p-3">
    <AudioBufferTest :set-synth-fn="setSynthFn" :synth-fn="synthFn" class="mb-3" />
    <FourierTransform :set-synth-fn="setSynthFn" :synth-fn="synthFn" />
  </div>
</template>
