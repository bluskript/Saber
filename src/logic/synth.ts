export type SynthFn = (channel: Float32Array, position: number, sampleRate: number) => void
export type FreqSynthFn = (freq: number, phase: number) => SynthFn

export const combine = (...fns: (SynthFn | undefined)[]): SynthFn => {
  return (channel, position, sampleRate) => {
    fns.forEach((fn) => {
      if (!fn) return
      const output = new Float32Array(channel.length)
      fn(output, position, sampleRate)
      channel.forEach((_, i) => channel[i] += output[i])
    })
  }
}

export const combineFreqSynths = (...fns: (FreqSynthFn | undefined)[]): FreqSynthFn => {
  return (freq: number) => {
    return combine(
      ...fns.map(v => v?.(freq, 0)),
    )
  }
}

/**
 * Takes in a synth and resizes PCM data from -1..1 to -1*volume..1*volume
 *
 * @param fn the synth function that comes in as an input
 * @returns a synth function with lowered volume
 */
export const applyVolume = (fn: SynthFn, volume: number): SynthFn => {
  return (channel, position, sampleRate) => {
    fn(channel, position, sampleRate)
    channel.forEach((_, i) => {
      channel[i] *= volume
    })
  }
}

export const whiteNoise: SynthFn = (channel: Float32Array) => {
  channel.forEach((_, i) => {
    channel[i] += Math.random() * 2 - 1
  })
}

/**
 * Plays many synths at the same time which are detuned from each other
 *
 * @param frequency the frequency of the original saw
 * @param voices the number of saws
 * @param detune the percentage of detune
 * @returns a combined array of saws
 */
export const detuned = (synth: FreqSynthFn, voices = 1, detune = 0): FreqSynthFn => {
  return combineFreqSynths(
    ...[...new Array(voices)].map((_, i) => (freq: number) => {
      const range = (freq / 2) * detune
      const offset = (detune / voices) * i
      return synth(freq + range * offset, Math.random())
    }),
  )
}

/**
 * @param frequency hz frequency of osc
 * @param phase the phase start of the sawtooth in percentage
 * @returns a synth function that generates a saw wave
 */
export const sawTooth = (frequency = 512, phase = 0): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += (phase + (oscPos / oscSize)) % 1 * 2 - 1
    })
  }
}

export const square = (frequency = 512, phase: number): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += (phase + (oscPos / oscSize)) % 1 < 0.5 ? -1 : 1
    })
  }
}

export const sine = (frequency = 512, phase: number): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += Math.sin((phase + oscPos / oscSize) * (2 * Math.PI))
    })
  }
}

export const triangle = (frequency = 512, phase: number): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += Math.abs((phase + (oscPos / oscSize)) % 1 * 2 - 1) - 0.5
    })
  }
}
