class Complex {
  r: number
  i: number

  constructor(r: number, i: number) {
    this.r = r
    this.i = i
  }

  add(other: Complex) {
    return new Complex(this.r + other.r, this.i + other.i)
  }

  sub(other: Complex) {
    return new Complex(this.r - other.r, this.i - other.i)
  }

  mult(other: Complex) {
    return new Complex(
      this.r * other.r - this.i * other.i,
      this.r * other.i + this.i * other.r,
    )
  }

  /**
   * Euler's formula
   * e^ix = cosx + isinx
   */
  cexp() {
    const exp = Math.exp(this.r)
    return new Complex(
      exp * Math.cos(this.i),
      exp * Math.sin(this.i),
    )
  }
}

function innerFFT(amplitudes: Complex[]) {
  const len = amplitudes.length
  if (len <= 1) return amplitudes
  const half = len / 2

  // divide even and odd
  let even = []
  let odd = []
  even.length = odd.length = half
  for (let i = 0; i < half; i++) {
    even[i] = amplitudes[i * 2]
    odd[i] = amplitudes[i * 2 + 1]
  }

  // recursively apply FFT
  even = innerFFT(even)
  odd = innerFFT(odd)

  // combine result
  const a = -2 * Math.PI
  for (let i = 0; i < half; i++) {
    // the progress along the signal
    const progress = i / len
    // fourier transform
    const pos = new Complex(0, a * progress).cexp().mult(odd[i])
    amplitudes[i] = odd[i] = even[i].add(pos)
    amplitudes[half + i] = even[i] = even[i].sub(pos)
  }

  return amplitudes
}

export function fft(amplitudes: number[]): Complex[] {
  return innerFFT(
    amplitudes.map(v => new Complex(v, 0)),
  )
}

export function inverseFFT(amplitudes: Complex[]) {
  const len = amplitudes.length
  const inverse = 1 / len

  // conjugate imaginaries
  for (let i = 0; i < len; ++i)
    amplitudes[i].i = -amplitudes[i].i

  // apply fourier transform
  amplitudes = innerFFT(amplitudes)

  for (let i = 0; i < len; ++i) {
    // conjugate again
    amplitudes[i].i = -amplitudes[i].i
    // scale
    amplitudes[i].r *= inverse
    amplitudes[i].i *= inverse
  }
  return amplitudes
}
