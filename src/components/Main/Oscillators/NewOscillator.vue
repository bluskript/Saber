<script lang="ts" setup>
import { reactive, ref } from '@vue/reactivity'
import Saw from '~/assets/icons/saw.svg?component'
import Square from '~/assets/icons/square.svg?component'
import Sine from '~/assets/icons/sine.svg?component'
import Triangle from '~/assets/icons/triangle.svg?component'
import SquareBtnToggle from '~/components/SquareBtnToggle.vue'

const options = [
  { icon: Saw, value: 'saw' },
  { icon: Square, value: 'square' },
  { icon: Sine, value: 'sine' },
  { icon: Triangle, value: 'triangle' },
]

const waveform = ref<'saw' | 'square' | 'sine' | 'triangle'>('saw')

interface IModifier {
  name: string
  shortName: string
  value: number
  min: number
  max: number
  step: number
  default?: number
  percent?: boolean
}

const params = reactive<IModifier[]>([
  { name: 'octave', shortName: 'OCT', value: 0, min: -4, max: 4, step: 1 },
  { name: 'semitones', shortName: 'ST', value: 0, min: -12, max: 12, step: 1 },
  { name: 'detune', shortName: 'DET', value: 0, min: -100, max: 100, step: 1 },
  { name: 'unison', shortName: 'UNI', value: 1, min: 1, max: 16, step: 1, default: 1 },
  { name: 'tune', shortName: 'TUNE', value: 0, min: -100, max: 100, step: 1 },
  { name: 'pan', shortName: 'PAN', value: 0, min: -1, max: 1, step: 0.01, percent: true },
])
</script>

<template>
  <div class="bg-harmonydark-700 p-3 gap-2 flex">
    <div class="flex flex-col gap-2">
      <SquareBtnToggle v-model="waveform" :options="options" />
    </div>
    <Modifiers :params="params" />
  </div>
</template>
