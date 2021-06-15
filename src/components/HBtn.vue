<script setup lang="ts">
import { computed, defineProps } from 'vue'
const props = defineProps<{
  variant: 'text' | 'filled' | 'outlined' | 'active'
  color?: 'primary' | 'secondary'
  icon?: boolean
  floating?: boolean
  flat?: boolean
  dense?: boolean
}>()
const buttonClasses = computed(() => ({
  btn: true,
  [props.variant]: true,
  [props.color || 'plain']: true,
  icon: props.icon,
  floating: props.floating,
  raised: !props.flat,
  dense: props.dense,
}))
</script>
<template>
  <button v-wave :class="buttonClasses">
    <slot />
  </button>
</template>

<style lang="postcss" scoped>
.primary {
  --button-color: theme('colors.primary.400');
}

.secondary {
  --button-color: theme('colors.secondary.400');
}

.btn {
  @apply
    px-4 py-2 rounded focus:outline-none transition duration-200
    ease-in-out flex justify-center
    items-center cursor-pointer select-none;
  &.dense {
    @apply p-2 rounded-none;
  }

  &:disabled {
    @apply pointer-events-none;
  }
}

.icon {
  @apply rounded-full p-3 w-auto;
}

.floating {
  &:hover {
    transform: translate(0, -0.125rem);
  }
  &:active {
    transform: translate(0);
  }
}

.raised {
  &:hover {
    @apply shadow-sm;
  }
  &:active {
    @apply shadow-lg;
  }
}

.active {
  @apply bg-gradient-to-br from-purple-600 to-blue-600 text-white;

  &:hover {
    @apply bg-gradient-to-br from-purple-700 to-blue-700;
  }
}

.filled {
  @apply bg-buttoncolor text-white;
  &:hover {
    @apply bg-primary-500;
  }
}
.outlined {
  @apply border-buttoncolor border-1 text-buttoncolor;
}
.text {
  @apply text-primary-400;
  &:hover {
    @apply bg-primary-300 bg-opacity-10;
  }
}

@variants disabled {
  .btn.text {
    @apply text-gray-500;
  }
  .btn.outlined {
    @apply text-gray-500 border-gray-500;
  }
  .btn.filled {
    @apply bg-gray-400 dark:bg-gray-600 text-gray-500 dark:text-gray-500 bg-opacity-75;
  }
}
</style>
