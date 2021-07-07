<script lang="ts" setup>
import NewOscillator from './NewOscillator.vue'
import Column from '~/components/Main/Column.vue'

import { ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import { onKeyDown, onKeyUp } from '@vueuse/core'
import Oscillator from '~/components/Main/Oscillators/Oscillator.vue'
import FourierVisualizer from '~/components/Main/FlexZone/FourierVisualizer.vue'
import SynthDisplay from '~/components/Main/FlexZone/Waveform.vue'
import { applyVolume, combine } from '~/logic/synths'
import type { SynthFn } from '~/logic/synths'
import { keys } from '~/logic/keysound'
import HSlider from '~/components/HSlider.vue'
import HBtn from '~/components/HBtn.vue'
import Keyboard from '~/components/Main/Keyboard.vue'
import { OscManager } from '~/logic/oscManager'
import { setSampleRate } from '~/logic/sampleRate'
import { useFourier } from '~/logic/useFourier'
import FrequencyView from '~/components/Main/FlexZone/Spectrum.vue'

let ctx: AudioContext

if (!import.meta.env.SSR) {
  ctx = new AudioContext()
  setSampleRate(ctx.sampleRate)
}

let position = 0

const volume = ref(0.2)
const sampleSize = ref(11)
const actualSampleSize = computed(() => Math.pow(2, sampleSize.value))

const oscManager = new OscManager()

const getSynthForSemitone = (semitone: number): SynthFn => {
  const baseFrequency = 131
  const increase = Math.pow(2, semitone / 12)

  return oscManager.freqSynthFn.value(baseFrequency * increase, 0)
}

const synthFn = computed(() => {
  return applyVolume(
    combine(
      ...[...oscManager.semitonesDown].map(k => getSynthForSemitone(k)),
    ),
    volume.value,
  )
})

const fourierArr = useFourier(synthFn, actualSampleSize)

onMounted(async() => {
  const processor = ctx.createScriptProcessor(1024, 0, 1)
  processor.addEventListener('audioprocess', (ev) => {
    const outputBuffer = ev.outputBuffer
    const targetChannel = outputBuffer.getChannelData(0)
    synthFn.value?.(targetChannel, position, ctx.sampleRate)
    position += outputBuffer.length
  })
  processor.connect(ctx.destination)
})

onKeyDown(ev => keys[ev.key] !== undefined && !ev.repeat, (ev) => {
  oscManager.semitoneDown(keys[ev.key])
})

onKeyUp(ev => keys[ev.key] !== undefined && !ev.repeat, (ev) => {
  if (ev.shiftKey) return
  oscManager.semitoneUp(keys[ev.key])
})

</script>

<template>
  <Column>
    <template #title>
      Owo<strong class="text-secondary-300">kill</strong><strong class="text-textcolor">ators</strong>
    </template>
    <HBtn
      variant="text"
      class="w-full"
      @click="() => oscManager.addOsc()"
    >
      <carbon-add />
    </HBtn>
    <div
      v-for="(id, i) in oscManager.synthArr"
      v-show="oscManager.selectedOsc.value === id"
      :key="id"
      class="w-full bg-light-500 dark:bg-harmonydark-400 p-3 flex-1 block h-full"
    >
      <h1 class="text-2xl mb-2">
        Oscillator {{ i + 1 }}
      </h1>
      {{oscManager.setFreqSynthFn(id)}}
      <Oscillator
        :set-synth-fn="oscManager.setFreqSynthFn(id)"
        :delete="() => oscManager.deleteOsc(i)"
        :delete-enabled="Object.keys(oscManager.synths).length > 1"
      />
    </div>
    <!-- <NewOscillator /> -->
  </Column>
</template>
