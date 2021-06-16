import { computed } from '@vue/runtime-core'
import { Ref } from 'vue'
import { fft } from './fft'
import { sampleRate } from './sampleRate'
import { SynthFn } from './synths'

export const useFourier = (fn: Ref<SynthFn | undefined>, sampleSize: Ref<number>) => {
  return computed(() => {
    const arr = Float32Array.of(...Array(sampleSize.value).fill(0))
    fn.value?.(arr, 0, sampleRate)
    const fftArr = fft([...arr])
    return fftArr
  })
}
