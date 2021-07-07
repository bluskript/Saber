
<script lang="ts" setup>
import { defineEmit, defineProps } from 'vue'
import type { Component } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
  waveforms: {value: string; icon: Component}[]
}>()
const emit = defineEmit(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
</script>

<template>
  <SquareBtn v-for="waveform of waveforms" :key="waveform.value" :active="waveform.value === model" @click="model = waveform.value">
    <component :is="waveform.icon"></component>
  </SquareBtn>
</template>
