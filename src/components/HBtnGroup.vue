<script lang="ts">
import { provide, ref } from '@vue/runtime-core'

provide('selected', ref(0))
</script>

<template>
  <div class="btn-group">
    <slot />
  </div>
</template>

<style lang="postcss">
.btn-group {
  @apply flex;

  & > * {
    @apply rounded-none;
  }

  &:first-child {
    @apply rounded-md;
  }
}
</style>
