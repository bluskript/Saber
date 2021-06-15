<script lang="ts" setup>
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import { onKeyDown, onKeyUp } from '@vueuse/core'
import Oscillator from '../components/Main/Oscillator.vue'
import FourierTransform from '../components/Main/FourierTransform.vue'
import SynthDisplay from '../components/Main/SynthDisplay.vue'
import { applyVolume, combine, combineFreqSynths } from '~/logic/synth'
import type { SynthFn, FreqSynthFn } from '~/logic/synth'
import { keys } from '~/logic/keysound'
import HSlider from '~/components/HSlider.vue'
import HBtn from '~/components/HBtn.vue'
import { randStr } from '~/logic/randstr'
import Keyboard from '~/components/Main/Keyboard.vue'

let ctx: AudioContext

if (!import.meta.env.SSR)
  ctx = new AudioContext()
let position = 0

const volume = ref(0.2)
const selectedOsc = ref('initial')
const pianoOpen = ref(false)

const semitonesDown = reactive(new Set<number>())
const synths = reactive<{
  [id: string]: FreqSynthFn | undefined
}>({
  initial: undefined,
})
const idArr = reactive<string[]>([
  'initial',
])
const freqSynthFn = computed(() => {
  return combineFreqSynths(
    ...Object.values(synths),
  )
})

const deleteOsc = (i: number) => {
  const id = idArr[i]
  idArr.splice(i, 1)
  delete synths[id]
  if (i === 0) {
    selectedOsc.value = idArr[i]
    return
  }
  selectedOsc.value = idArr[i - 1]
}

const addOsc = () => {
  const id = randStr()
  synths[id] = undefined
  idArr.push(id)
  selectedOsc.value = idArr[idArr.length - 1]
}

const getSynthForSemitone = (semitone: number): SynthFn => {
  const baseFrequency = 131
  const increase = Math.pow(2, semitone / 12)

  return freqSynthFn.value(baseFrequency * increase, 0)
}

const synthFn = computed(() => {
  return applyVolume(
    combine(
      ...[...semitonesDown].map(k => getSynthForSemitone(k)),
    ),
    volume.value,
  )
})

const setFreqSynthFn = (id: string) => {
  return (fn: FreqSynthFn) => synths[id] = fn
}

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
  if (!freqSynthFn.value) return
  semitonesDown.add(keys[ev.key])
})

onKeyUp(ev => keys[ev.key] !== undefined && !ev.repeat, (ev) => {
  semitonesDown.delete(keys[ev.key])
})
</script>

<template>
  <Keyboard v-show="pianoOpen" v-model="pianoOpen" :keys-down="semitonesDown" :key-down="(i) => semitonesDown.add(i)" :key-up="(i) => semitonesDown.delete(i)" />
  <div
    class="p-3"
  >
    <Card class="mb-2">
      <h2 class="text-xl mb-3">
        Synthesizer
      </h2>
      <h3 class="text-yellow-300 sm:hidden text-lg">
        * Best experience on desktop or landscape mode
      </h3>
      <div class="mb-3">
        <div>
          <HSlider v-model="volume" min="0" max="1" step="0.01" label="Master Volume" />
        </div>
      </div>
      <HBtn variant="outlined" color="primary" class="mb-3" @click="pianoOpen = true">
        <mdi-keyboard />
        <span class="ml-1">Open Piano</span>
      </HBtn>
      <div class="flex">
        <div class="bg-light-400 p-3 dark:bg-harmonydark-100 overflow-auto flex flex-col gap-2">
          <HBtn variant="text" class="w-full" @click="addOsc">
            <carbon-add />
          </HBtn>
          <HBtn
            v-for="(id, i) in idArr"
            :key="id"
            :variant="selectedOsc === id ? 'active' : 'text'"
            class="w-full"
            @click="selectedOsc = id"
          >
            OSC{{ i+1 }}
          </HBtn>
        </div>
        <div
          v-for="(id, i) in idArr"
          v-show="selectedOsc === id"
          :key="id"
          class="w-full bg-light-500 dark:bg-harmonydark-400 p-3 flex-1 block h-full"
        >
          <h1 class="text-2xl mb-2">
            Oscillator {{ i + 1 }}
          </h1>
          <Oscillator
            :set-synth-fn="setFreqSynthFn(id)"
            :delete="() => deleteOsc(i)"
            :delete-enabled="Object.keys(synths).length > 1"
          />
        </div>
      </div>
      <p class="text-sm mt-2">
        Use your computer keyboard to play notes (Middle row for white keys, top row for sharps / flats)
      </p>
    </Card>
    <div class="grid lg:grid-cols-2 auto-rows-fr">
      <SynthDisplay :fn="synthFn" class="mb-2" />
      <FourierTransform :synth-fn="synthFn" />
    </div>
  </div>
</template>
