<script setup lang="ts">
import NavBar from './NavBar.vue'
import Synth from './Synth.vue'
import HBtn from '~/components/HBtn.vue'
import HSpacer from '~/components/HSpacer.vue'
import { toggleDark } from '~/logic/dark'
</script>

<template>
  <NavBar>
    <h1 class="font-light text-xl">
      Saber
    </h1>
    <HSpacer />
    <HBtn icon variant="text" @click="toggleDark()">
      <carbon-moon />
    </HBtn>
  </NavBar>
  <Synth />
</template>
