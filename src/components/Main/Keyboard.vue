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
  <div class="fixed bottom-0 left-0 flex overflow-none z-1" @click.stop="">
    <template v-for="i in 6" :key="i">
      <PianoKey
        v-for="j in 12"
        :key="j"
        :black="isBlack(j)"
        :offset="!isBlack(j)"
        :held-down="props.keysDown.has(getSemitone(i, j))"
        @mousedown.passive="props.keyDown(getSemitone(i, j))"
        @mouseup="props.keyUp(getSemitone(i, j))"
        @touchstart.passive="props.keyDown(getSemitone(i, j))"
        @touchend.passive="props.keyUp(getSemitone(i, j))"
      />
    </template>
  </div>
</template>
