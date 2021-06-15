<script setup lang="ts">
import NavBar from '../components/Main/NavBar.vue'
import Main from './Main.vue'
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
      <mdi-theme-light-dark />
    </HBtn>
    <HBtn icon variant="text" target="_blank" href="https://github.com/Bluskript/Saber">
      <mdi-github />
    </HBtn>
  </NavBar>
  <Main />
</template>
