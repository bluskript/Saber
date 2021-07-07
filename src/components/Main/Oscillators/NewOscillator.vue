<script lang="ts" setup>
import { computed, reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import Saw from '~/assets/icons/saw.svg?component'
import Square from '~/assets/icons/square.svg?component'
import Sine from '~/assets/icons/sine.svg?component'
import Triangle from '~/assets/icons/triangle.svg?component'
import SquareBtnToggle from '~/components/SquareBtnToggle.vue'
import { defineProps } from 'vue'
import { OscManager } from '~/logic/oscManager'
import type { FreqSynthFn } from '~/logic/synths'
import { applyVolume, detuned, sawTooth, sine, square, triangle } from '~/logic/synths'

const waveforms = [
  { icon: Saw, value: 'saw' },
  { icon: Square, value: 'square' },
  { icon: Sine, value: 'sine' },
  { icon: Triangle, value: 'triangle' },
]

const props = defineProps<{
  index: number
  oscId: string
  oscManager: OscManager
}>();

const selectedWaveform = ref<'saw' | 'square' | 'sine' | 'triangle'>('saw')

interface IModifier {
  name: string
  shortName: string
  value: any
  min: number
  max: number
  step: number
  default?: number
  percent?: boolean
}

const synths: {
  [name: string]: FreqSynthFn
} = {
  sine,
  saw: sawTooth,
  square,
  triangle,
}

const params = reactive<IModifier[]>([
  { name: 'octave', shortName: 'OCT', value: 0, min: -4, max: 4, step: 1 },
  { name: 'semitones', shortName: 'ST', value: semitones, min: -12, max: 12, step: 1 },
  { name: 'detune', shortName: 'DET', value: detunePercent, min: -100, max: 100, step: 1 },
  { name: 'unison', shortName: 'UNI', value: detuneVoices, min: 1, max: 16, step: 1, default: 1 },
  { name: 'tune', shortName: 'TUNE', value: 0, min: -100, max: 100, step: 1 },
  { name: 'pan', shortName: 'PAN', value: 0, min: -1, max: 1, step: 0.01, percent: true },
])

const selectedSynthName = ref<string | undefined>('saw')
const selectedSynth = computed(() => {
  return selectedSynthName.value ? synths[selectedSynthName.value] : undefined
})

const freqSynthFn = computed<FreqSynthFn | undefined>(() => {
  const freqSynthFn = selectedSynth.value
  if (!freqSynthFn) return
  return (freq) => {
    freq *= Math.pow(2, semitones.value / 12)
    return applyVolume(
      detuned(
        freqSynthFn,
        detuneVoices.value,
        detunePercent.value,
      )(freq, 0),
      volume.value,
    )
  }
})

const volume = ref(0.5)
const disabled = ref(false)




onMounted(() => props.oscManager.setFreqSynthFn(props.oscId))

</script>
      
<template>
  <div class="bg-harmonydark-700 p-3 gap-2 flex">
    <div class="flex flex-col gap-2">
      <SquareBtnToggle v-model="selectedWaveform" @click="selectedSynthName = selectedWaveform" :waveforms="waveforms"/>
    </div>
    <Modifiers :params="params" />
    <TrashCan @click="oscManager.deleteOsc(props.index)">DELETUS</TrashCan>
  </div>
</template>

