<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import Saw from '~/assets/icons/saw.svg?component'
import Square from '~/assets/icons/square.svg?component'
import Sine from '~/assets/icons/sine.svg?component'
import Triangle from '~/assets/icons/triangle.svg?component'
import SquareBtn from '~/components/SquareBtn.vue'
import SquareBtnToggle from '~/components/SquareBtnToggle.vue'

const waveform = ref<'saw' | 'square' | 'sine' | 'triangle'>('saw')

const options = [
  { icon: Saw, value: 'saw' },
  { icon: Square, value: 'square' },
  { icon: Sine, value: 'sine' },
  { icon: Triangle, value: 'triangle' },
]
</script>

<template>
  <div class="bg-harmonydark-700 p-3">
    <div class="flex flex-col gap-2">
      <SquareBtnToggle v-model="waveform" :options="options" />
    </div>
  </div>
</template>
