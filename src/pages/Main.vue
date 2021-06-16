<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import { onKeyDown, onKeyUp } from '@vueuse/core'
import Oscillator from '../components/Main/Oscillator.vue'
import FourierVisualizer from '../components/Main/FourierVisualizer.vue'
import SynthDisplay from '../components/Main/SynthDisplay.vue'
import { applyVolume, combine } from '~/logic/synths'
import type { SynthFn } from '~/logic/synths'
import { keys } from '~/logic/keysound'
import HSlider from '~/components/HSlider.vue'
import HBtn from '~/components/HBtn.vue'
import Keyboard from '~/components/Main/Keyboard.vue'
import { OscManager } from '~/logic/oscManager'
import { setSampleRate } from '~/logic/sampleRate'
import { useFourier } from '~/logic/useFourier'
import FrequencyView from '~/components/Main/FrequencyView.vue'

let ctx: AudioContext

if (!import.meta.env.SSR) {
  ctx = new AudioContext()
  setSampleRate(ctx.sampleRate)
}

let position = 0

const volume = ref(0.2)
const pianoOpen = ref(false)
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
  oscManager.semitoneUp(keys[ev.key])
})
</script>

<template>
  <Keyboard
    v-show="pianoOpen"
    v-model="pianoOpen"
    :keys-down="oscManager.semitonesDown"
    :key-down="(i) => oscManager.semitoneDown(i)"
    :key-up="(i) => oscManager.semitoneUp(i)"
  />
  <div
    class="p-3"
  >
    <div class="grid grid-cols-2 gap-2 mb-2">
      <SynthDisplay :fn="synthFn" class="mb-2" />
      <FrequencyView :fourier-arr="fourierArr" />
    </div>
    <div class="grid md:grid-cols-2 auto-rows-fr gap-2">
      <Card>
        <h2 class="text-xl">
          Synthesizer
        </h2>
        <h3 class="text-yellow-300 sm:hidden">
          * Best experience on desktop or landscape mode
        </h3>
        <div class="my-3">
          <div>
            <HSlider v-model="volume" min="0" max="1" step="0.01" label="Master Volume" />
          </div>
        </div>
        <HBtn variant="outlined" color="primary" class="mb-3" @click="pianoOpen = !pianoOpen">
          <mdi-keyboard />
          <span class="ml-1">Toggle Piano</span>
        </HBtn>
        <div class="flex">
          <div class="bg-light-400 p-3 dark:bg-harmonydark-100 overflow-auto flex flex-col gap-2 w-24">
            <HBtn
              variant="text"
              class="w-full"
              @click="() => oscManager.addOsc()"
            >
              <carbon-add />
            </HBtn>
            <HBtn
              v-for="(id, i) in oscManager.synthArr"
              :key="id"
              :variant="oscManager.selectedOsc.value === id ? 'active' : 'text'"
              class="w-full"
              @click="oscManager.selectedOsc.value = id"
            >
              OSC{{ i+1 }}
            </HBtn>
          </div>
          <div
            v-for="(id, i) in oscManager.synthArr"
            v-show="oscManager.selectedOsc.value === id"
            :key="id"
            class="w-full bg-light-500 dark:bg-harmonydark-400 p-3 flex-1 block h-full"
          >
            <h1 class="text-2xl mb-2">
              Oscillator {{ i + 1 }}
            </h1>
            <Oscillator
              :set-synth-fn="oscManager.setFreqSynthFn(id)"
              :delete="() => oscManager.deleteOsc(i)"
              :delete-enabled="Object.keys(oscManager.synths).length > 1"
            />
          </div>
        </div>
        <p class="text-sm mt-2">
          Use your computer keyboard to play notes (Middle row for white keys, top row for sharps / flats)
        </p>
      </Card>
      <FourierVisualizer :synth-fn="synthFn" :fourier-arr="fourierArr" />
    </div>
  </div>
</template>
