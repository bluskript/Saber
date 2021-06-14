export type SynthFn = (channel: Float32Array, position: number, sampleRate: number) => void
export type FreqSynthFn = (freq: number) => SynthFn

export const combine = (...fns: SynthFn[]): SynthFn => {
  return (channel, position, sampleRate) => {
    fns.forEach(fn => fn(channel, position, sampleRate))
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
 * @param frequency hz frequency of osc
 * @param phaseStart the phase start of the sawtooth in percentage
 * @returns a synth function that generates a saw wave
 */
export const sawTooth = (frequency = 512, phaseStart = 0): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += (phaseStart + (oscPos / oscSize)) % 1 * 2 - 1
    })
  }
}

/**
 * One of the most famous sounds in EDM
 *
 * Plays many saws at the same time which are detuned from each other
 *
 * @param frequency the frequency of the original saw
 * @param voices the number of saws
 * @param detune the percentage of detune
 * @returns a combined array of saws
 */
export const detunedSaw = (frequency = 512, voices = 1, detune = 0, phase = true, phaseAmount = 0): SynthFn => {
  return combine(
    ...[...new Array(voices)].map((_, i) => {
    // 1 octave down = frequency / 2
      const range = (frequency / 2) * detune
      const offset = (detune / voices) * i
      return sawTooth(frequency + range * offset, phase ? Math.random() : phaseAmount)
    }),
  )
}

export const square = (frequency = 512): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += (oscPos / oscSize) < 0.5 ? -1 : 1
    })
  }
}

export const sine = (frequency = 512): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += Math.sin(oscPos / oscSize * 2 * Math.PI)
    })
  }
}

export const triangle = (frequency = 512): SynthFn => {
  return (channel: Float32Array, position: number, sampleRate: number) => {
    channel.forEach((_, i) => {
      const oscSize = sampleRate / frequency
      const oscPos = (position + i) % oscSize
      channel[i] += Math.abs((oscPos / oscSize) % 1 * 2 - 1) - 0.5
    })
  }
}
