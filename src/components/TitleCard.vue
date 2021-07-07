<template>
  <div class="rounded overflow-hidden">
    <div class="header">
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.header {
  @apply dark:bg-harmonydark-300 dark:text-sabertext py-1 px-2 flex items-center bg-light-300;
}
</style>
