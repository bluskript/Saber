<script lang="ts" setup>
import { computed, defineProps, ref, watch } from '@vue/runtime-core'
import { onKeyDown, onKeyUp } from '@vueuse/core'
import Display from './Display.vue'
import Card from '~/components/Card.vue'
import { applyVolume, combine, detunedSaw, sawTooth, square } from '~/logic/synth'
import type { SynthFn, FreqSynthFn } from '~/logic/synth'
import HSlider from '~/components/HSlider.vue'
import { keys } from '~/logic/keysound'
import HBtn from '~/components/HBtn.vue'

const props = defineProps<{
  setSynthFn: (fn: SynthFn) => void
  synthFn?: SynthFn
}>()

const setSynthFn = props.setSynthFn
const synthFn = computed(() => props.synthFn)

const volume = ref(0.1)
const octave = ref(0)
const selectedSynth = ref<string | undefined>(undefined)
const synths: {
  [name: string]: FreqSynthFn
} = {
  'saw': sawTooth,
  'detuned saw': freq => detunedSaw(freq, 7, 0.25),
  'square': square,
}

let freqSynth: FreqSynthFn | undefined

const keysDown = new Set<string>()

const getSynthForKey = (key: string): SynthFn => {
  const baseFrequency = 131 * Math.pow(2, octave.value)
  const increase = Math.pow(2, keys[key] / 12)

  return freqSynth!(baseFrequency * increase)
}

const updateSynthFn = () => {
  setSynthFn(
    applyVolume(
      combine(
        ...[...keysDown].map(getSynthForKey),
      ),
      volume.value,
    ),
  )
}

watch([selectedSynth, octave, volume], updateSynthFn)

const setSelectedSynth = (name: string) => {
  freqSynth = synths[name]
  selectedSynth.value = name
}

onKeyDown(ev => keys[ev.key] !== undefined && !ev.repeat, (ev) => {
  if (!freqSynth) return
  keysDown.add(ev.key)
  updateSynthFn()
})

onKeyUp(ev => keys[ev.key] !== undefined && !ev.repeat, (ev) => {
  keysDown.delete(ev.key)
  updateSynthFn()
})
</script>

<template>
  <Card>
    <h2 class="text-xl mb-3">
      Synthesizer
    </h2>
    <div class="flex">
      <div class="w-full md:w-min">
        <div class="flex">
          <HBtn
            v-for="(_, synthName) in synths"
            :key="synthName"
            :variant="selectedSynth === synthName ? 'active' : 'outlined'"
            color="primary"
            class="mr-2"
            @click="setSelectedSynth(synthName)"
          >
            {{ synthName }}
          </HBtn>
        </div>
        <label class="text-sm">Volume</label>
        <HSlider v-model="volume" class="mb-6" min="0" max="1" step="0.01" />
        <label class="text-sm">Octave</label>
        <HSlider v-model="octave" class="mb-6" min="-6" max="6" step="1" />
      </div>
      <div class="flex-1 px-3">
        <Display :fn="synthFn" />
      </div>
    </div>
  </Card>
</template>
