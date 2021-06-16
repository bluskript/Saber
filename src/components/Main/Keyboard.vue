<script lang="ts" setup>
import { defineEmit, defineProps } from '@vue/runtime-core'
import { useVModel } from '@vueuse/core'
import PianoKey from './PianoKey.vue'

const props = defineProps<{
  modelValue: boolean
  keysDown: Set<number>
  keyDown: (key: number) => void
  keyUp: (key: number) => void
}>()
const emit = defineEmit(['update:modelValue'])

const open = useVModel(props, 'modelValue', emit)

const isBlack = (semitone: number) => {
  return [
    1,
    3,
    6,
    8,
    10,
    12,
  ].includes(semitone - 1)
}

const getSemitone = (i: number, j: number) => {
  return (j - 1) + ((i - 1) * 12)
}
</script>

<template>
  <div
    class="absolute w-screen h-screen bg-gray-400 bg-opacity-20 overflow-hidden"
    @click="open = false"
  >
    <div class="relative w-full h-full">
      <div class="absolute bottom-0 left-0 flex" @click.stop="">
        <template v-for="i in 4" :key="i">
          <PianoKey
            v-for="j in 12"
            :key="j"
            :black="isBlack(j)"
            :offset="!isBlack(j)"
            :held-down="props.keysDown.has(getSemitone(i, j))"
            @mousedown="props.keyDown(getSemitone(i, j))"
            @mouseup="props.keyUp(getSemitone(i, j))"
            @touchstart="props.keyDown(getSemitone(i, j))"
            @touchend="props.keyUp(getSemitone(i, j))"
          />
        </template>
      </div>
    </div>
  </div>
</template>
