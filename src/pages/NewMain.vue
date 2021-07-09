<script lang="ts" setup>
import { onKeyDown, onKeyUp } from '@vueuse/core'
import { onMounted } from 'vue'
import Oscillators from '~/components/Main/Oscillators/Oscillators.vue'
import Visuals from '~/components/Main/FlexZone/Visuals.vue'
import Keyboard from '~/components/Main/Keyboard.vue'
import { oscManager } from '~/logic/oscManager'
import { keys } from '~/logic/keysound'

function onMIDIInit(midi) {
  const midiAccess = midi

  let haveAtLeastOneDevice = false
  const inputs = midiAccess.inputs.values()
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = MIDIMessageEventHandler
    haveAtLeastOneDevice = true
  }
  if (!haveAtLeastOneDevice)
    alert('No MIDI input devices present.  You\'re gonna have a bad time.')
}

function MIDIMessageEventHandler(event) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xF0) {
    case 0x90:
      if (event.data[2] != 0) { // if velocity != 0, this is a note-on message
        oscManager.semitoneDown(event.data[1] - 36)
      }
      break
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      oscManager.semitoneUp(event.data[1] - 36)
  }
}

onMounted(async() => {
  onMIDIInit(await navigator.requestMIDIAccess())
})

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
