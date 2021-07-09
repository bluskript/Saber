<script lang="ts" setup>
import FourierVisualizer from './FourierVisualizer.vue'
import Waveform from './Waveform.vue'
import Column from '~/components/Main/Column.vue'
import Spectrum from '~/components/Main/FlexZone/Spectrum.vue'
</script>

<template>
  <Column>
    <template #title>
      <div>
        Fl<strong class="text-secondary-300">ex</strong><strong class="text-textcolor">Zone</strong>
      </div>
    </template>
    <FourierVisualizer :fourier-arr="[]" />
    <Spectrum :fourier-arr="[]" />
    <Waveform />
  </Column>
</template>
