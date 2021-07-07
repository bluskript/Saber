<script setup lang="ts">
import { ref } from '@vue/reactivity'
import NavBar from '../components/Main/NavBar.vue'
import Main from './Main.vue'
import HBtn from '~/components/HBtn.vue'
import HSpacer from '~/components/HSpacer.vue'
import { toggleDark } from '~/logic/dark'

const clicked = ref(false)
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
  <Main v-if="clicked" />
  <div v-else class="flex items-center justify-center flex-1 p-6">
    <HBtn variant="filled" color="primary" @click="clicked = true">
      Audio won't play unless you press this button because of browser policies.
    </HBtn>
  </div>
</template>
