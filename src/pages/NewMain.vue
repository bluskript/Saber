<script lang="ts" setup>
import { onKeyDown, onKeyUp } from '@vueuse/core'
import init, { SynthProcessor, Config } from 'saber-engine'
import { onMounted } from 'vue'
import Oscillators from '~/components/Main/Oscillators/Oscillators.vue'
import Visuals from '~/components/Main/FlexZone/Visuals.vue'
import Keyboard from '~/components/Main/Keyboard.vue'
import { oscManager } from '~/logic/oscManager'
import { keys } from '~/logic/keysound'
import { useMidi } from '~/logic/midi'

onMounted(async() => {
  await init()
  const ctx = new AudioContext()
  const processor = SynthProcessor.new(ctx.sampleRate)

  console.log(Config.from_json({
    oscillators: [],
  }))
})

useMidi()

onKeyDown(ev => keys[ev.key] !== undefined && !ev.repeat, (ev) => {
  oscManager.semitoneDown(keys[ev.key])
})

onKeyUp(ev => keys[ev.key] !== undefined && !ev.repeat, (ev) => {
  if (ev.shiftKey) return
  oscManager.semitoneUp(keys[ev.key])
})
</script>

<template>
  <div class="h-full w-full bg-harmonydark-900 p-3 flex w-full h-full gap-3 relative">
    <Oscillators />
    <Visuals />
  </div>
  <Keyboard
    :keys-down="oscManager.semitonesDown"
    :key-down="(i) => oscManager.semitoneDown(i)"
    :key-up="(i) => oscManager.semitoneUp(i)"
  />
</template>
