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
  modifiers: IModifier[]
}>()
</script>

<template>
  <div class="flex-1 h-min">
    <div class="p-1 gap-1 bg-harmonydark-500 rounded flex">
      <Modifier
        v-for="mod of props.modifiers"
        :key="mod.name"
        v-model="mod.value"
        :label="mod.shortName"
        :min="mod.min"
        :max="mod.max"
        :step="mod.step"
        :percent="mod.percent"
        :default="mod.default"
      />
    </div>
  </div>
</template>
