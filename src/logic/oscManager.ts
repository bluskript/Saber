import { reactive, Ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { ref } from 'vue'
import { randStr } from './randstr'
import { combineFreqSynths, FreqSynthFn } from './synths'

type SynthObj = {
  [id: string]: FreqSynthFn | undefined
}

export class OscManager {
  semitonesDown: Set<number>
  synths: SynthObj
  synthArr: string[]
  freqSynthFn: Ref<FreqSynthFn>
  selectedOsc: Ref<string>

  constructor() {
    this.selectedOsc = ref('initial')
    this.semitonesDown = reactive(new Set<number>())
    this.synths = reactive({
      initial: undefined,
    })
    this.synthArr = reactive(['initial'])
    this.freqSynthFn = computed(() => combineFreqSynths(
      ...Object.values(this.synths),
    ))
  }

  addOsc() {
    const id = randStr()
    this.synths[id] = undefined
    this.synthArr.push(id)
    this.selectedOsc.value = id
  }

  deleteOsc(i: number) {
    const id = this.synthArr[i]
    delete this.synths[id]
    this.synthArr.splice(i, 1)
    if (i === 0) {
      this.selectedOsc.value = this.synthArr[i]
      return
    }
    this.selectedOsc.value = this.synthArr[i - 1]
  }

  setFreqSynthFn(id: string) {
    return (fn?: FreqSynthFn) => this.synths[id] = fn
  }

  semitoneDown(value: number) {
    this.semitonesDown.add(value)
  }

  semitoneUp(value: number) {
    this.semitonesDown.delete(value)
  }
}
