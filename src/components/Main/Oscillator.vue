<script lang="ts" setup>
import { computed, defineProps, ref, watch } from '@vue/runtime-core'
import { applyVolume, detuned, sawTooth, sine, square, triangle } from '~/logic/synth'
import type { FreqSynthFn } from '~/logic/synth'
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

watch(freqSynthFn, () => {
  props.setSynthFn(freqSynthFn.value)
})
</script>

<template>
  <div class="flex gap-2 mb-3">
    <HBtn
      v-for="(_, name) in synths"
      :key="name"
      :variant="selectedSynthName === name ? 'active' : 'outlined'"
      color="primary"
      @click="selectedSynthName = name"
    >
      {{ name }}
    </HBtn>
  </div>
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
  <HBtn class="mt-3" variant="outlined" color="secondary" :disabled="!deleteEnabled" @click="props.delete">
    Delete Osc
  </HBtn>
</template>
