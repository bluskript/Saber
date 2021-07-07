
<script lang="ts" setup>
import { defineEmit, defineProps } from 'vue'
import type { Component } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
  options: {value: string; icon: Component}[]
}>()
const emit = defineEmit(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
</script>

<template>
  <SquareBtn v-for="opt of options" :key="opt.value" :active="opt.value === model" @click="model = opt.value">
    <component :is="opt.icon"></component>
  </SquareBtn>
</template>
