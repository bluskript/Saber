<script lang="ts" setup>
import { computed, defineProps, onMounted, ref, watch, reactive } from '@vue/runtime-core'
import { applyVolume, detuned, sawTooth, sine, square, triangle } from '~/logic/synths'
import type { FreqSynthFn } from '~/logic/synths'
import HBtn from '~/components/HBtn.vue'

const props = defineProps<{
  setSynthFn: (fn?: FreqSynthFn) => void
  delete: () => void
  deleteEnabled: boolean
}>()

const volume = ref(0.5)
const semitones = ref(0)
const detunePercent = ref(0)
const detuneVoices = ref(1)
const disabled = ref(false)

const synths: {
  [name: string]: FreqSynthFn
} = {
  sine,
  saw: sawTooth,
  square,
  triangle,
}
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

watch([freqSynthFn, disabled], () => {
  if (disabled.value) {
    props.setSynthFn(undefined)
    return
  }
  props.setSynthFn(freqSynthFn.value)
})

// Import all the SVG icons as components
// So we can change their colors with CSS
import Saw from '~/assets/icons/saw.svg?component'
import Square from '~/assets/icons/square.svg?component'
import Sine from '~/assets/icons/sine.svg?component'
import Triangle from '~/assets/icons/triangle.svg?component'

// Make a table of all the waveforms with a value 
// So that when we cast a click the v-model updates to the value
const waveforms = [
  { icon: Saw, value: 'saw' },
  { icon: Square, value: 'square' },
  { icon: Sine, value: 'sine' },
  { icon: Triangle, value: 'triangle' },
]

// Interface that defines how a modifier object should look like
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

// These are reactive modifiers that will automatically update
// The synth's behavior
const modifiers = reactive<IModifier[]>([

  // Doesnt work
  { name: 'octave', shortName: 'OCT', value: 0, min: -4, max: 4, step: 1 },

  // Works
  { name: 'semitones', shortName: 'ST', value: semitones, min: -12, max: 12, step: 1 },

  // Works
  { name: 'detune', shortName: 'DET', value: detunePercent, min: -1, max: 1, step: 0.01 },

  // Works
  { name: 'unison', shortName: 'UNI', value: detuneVoices, min: 1, max: 16, step: 1, default: 1 },

  // Doesnt work
  { name: 'tune', shortName: 'TUNE', value: 0, min: -100, max: 100, step: 1 },

  // Doesnt work
  { name: 'pan', shortName: 'PAN', value: 0, min: -1, max: 1, step: 0.01, percent: true },
])

onMounted(() => props.setSynthFn(freqSynthFn.value))
</script>

<template>
  <div :class="{ disabled }">
    <div class="flex gap-2 mb-3 flex-wrap">
      <!-- Waveform buttons -->
      <SquareBtnToggle v-model="selectedSynthName" :waveforms="waveforms" />
    </div>
    <Modifiers :modifiers="modifiers" />

    <HSlider
      v-model="volume"
      label="Volume"
      class="mb-2"
      min="0"
      max="1"
      step="0.01"
    />
    <HSlider
      v-model="semitones"
      label="Semitones"
      min="-24"
      max="24"
      step="1"
      class="mb-2"
    />
    <HSlider
      v-model="detunePercent"
      label="Detune percent"
      min="0"
      max="1"
      step="0.01"
      class="mb-2"
    />
    <HSlider
      v-model="detuneVoices"
      label="Detune Voices"
      min="1"
      max="12"
      step="1"
      class="mb-2"
    />
  </div>
  <HBtn class="mt-3" variant="outlined" color="secondary" @click="disabled = !disabled">
    {{ disabled ? 'Enable Osc' : 'Disable Osc' }}
  </HBtn>
  <HBtn class="mt-3" variant="outlined" color="error" :disabled="!deleteEnabled" @click="props.delete">
    Delete Osc
  </HBtn>
</template>

<style lang="postcss" scoped>
.disabled {
  @apply pointer-events-none opacity-30;
}
</style>
