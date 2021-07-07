<script lang="ts" setup>
import NavBar from '~/components/Main/NavBar.vue'
import { toggleDark } from '~/logic/dark'
import HSpacer from '~/components/HSpacer.vue'
</script>

<template>
  <NavBar>
    <h1 class="font-bold text-2xl">
      <strong class="text-secondary-300">S</strong>aber
      <strong class="text-harmonydark-300 text-xl">v6.9</strong>
    </h1>
    <HSpacer />
    <HBtn icon dense variant="text" class="text-xl" @click="toggleDark()">
      <mdi-theme-light-dark />
    </HBtn>
    <HBtn
      icon
      dense
      variant="text"
      target="_blank"
      href="https://github.com/Bluskript/Saber"
      class="text-xl"
    >
      <mdi-github />
    </HBtn>
  </NavBar>
</template>
