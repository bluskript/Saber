<script lang="ts" setup>
import { defineProps } from 'vue'
import Modifier from '~/components/Modifier.vue'

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

const props = defineProps<{
  params: IModifier[]
}>()
</script>

<template>
  <div class="flex-1 h-min">
    <div class="p-1 gap-1 bg-harmonydark-500 rounded flex">
      <Modifier
        v-for="param of props.params"
        :key="param.name"
        v-model="param.value"
        :label="param.shortName"
        :min="param.min"
        :max="param.max"
        :step="param.step"
        :percent="param.percent"
        :default="param.default"
      />
    </div>
  </div>
</template>
