<script setup lang="ts">
import { ref } from '@vue/reactivity'
import NewMain from './NewMain.vue'
import HBtn from '~/components/HBtn.vue'
import Footer from '~/components/Main/Footer/Footer.vue'

const clicked = ref(false)
</script>

<template>
  <NewMain v-if="clicked" />
  <div v-else class="flex items-center justify-center flex-1 p-6">
    <HBtn variant="filled" color="primary" @click="clicked = true">
      Audio won't play unless you press this button because of browser policies.
    </HBtn>
  </div>
  <Footer />
</template>
