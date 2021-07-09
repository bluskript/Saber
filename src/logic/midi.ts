import { onMounted } from 'vue'
import { oscManager } from './oscManager'
function onMIDIInit(midi: WebMidi.MIDIAccess) {
  const midiAccess = midi
  const inputs = midiAccess.inputs.values()
  for (let input = inputs.next(); input && !input.done; input = inputs.next())
    input.value.onmidimessage = MIDIMessageEventHandler
}

function MIDIMessageEventHandler(event: WebMidi.MIDIMessageEvent) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xF0) {
    case 0x90:
      if (event.data[2] !== 0) { // if velocity != 0, this is a note-on message
        oscManager.semitoneDown(event.data[1] - 36)
      }
      break
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      oscManager.semitoneUp(event.data[1] - 36)
  }
}
export function useMidi() {
  onMounted(async() => {
    onMIDIInit(await navigator.requestMIDIAccess())
  })
}
