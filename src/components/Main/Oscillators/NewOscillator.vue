<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import Saw from '~/assets/icons/saw.svg?component'
import Square from '~/assets/icons/square.svg?component'
import Sine from '~/assets/icons/sine.svg?component'
import Triangle from '~/assets/icons/triangle.svg?component'
import SquareBtnToggle from '~/components/SquareBtnToggle.vue'
import Modifier from '~/components/Modifier.vue'

const options = [
  { icon: Saw, value: 'saw' },
  { icon: Square, value: 'square' },
  { icon: Sine, value: 'sine' },
  { icon: Triangle, value: 'triangle' },
]

const waveform = ref<'saw' | 'square' | 'sine' | 'triangle'>('saw')
const octave = ref(0)

</script>

<template>
  <div class="bg-harmonydark-700 p-3 flex">
    <div class="flex flex-col gap-2">
      <SquareBtnToggle v-model="waveform" :options="options" />
    </div>
    <div class="flex-1">
      <div class="p-2 bg-harmonydark-500">
        <Modifier v-model="octave" label="OCT" />
      </div>
    </div>
  </div>
</template>
