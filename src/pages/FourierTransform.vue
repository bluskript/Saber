<script lang="ts" setup>
import { defineProps } from 'vue'
import Card from '~/components/Card.vue'
import type { SynthFn } from '~/logic/synth'

const { setSynthFn } = defineProps<{
  setSynthFn: (fn: SynthFn) => void
}>()

</script>

<template>
  <Card>
    <h2 class="text-xl mb-3">
      Generating waveforms with fourier transform
    </h2>
  </Card>
</template>
