import { Ref } from '@vue/reactivity'
import { fft, inverseFFT } from './fft'
import { CanvasRenderer } from './renderer'
import { SynthFn } from './synth'

export class SynthRenderer extends CanvasRenderer {
  sampleRate: number
  sampleSize: Ref<number>
  drawHeight: Ref<number>
  fn: Ref<SynthFn | undefined>

  constructor(
    ctx: CanvasRenderingContext2D,
    fn: Ref<SynthFn | undefined>,
    drawHeight: Ref<number>,
    sampleSize: Ref<number>,
  ) {
    super(ctx)
    this.fn = fn
    this.drawHeight = drawHeight
    this.sampleSize = sampleSize
    this.canvas = ctx.canvas
    this.sampleRate = 44100
  }

  drawAxes() {
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.line(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2)
    this.line(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height)
    this.ctx.stroke()
  }

  /**
   * converts -1..1 to canvas height
   * @param value a value from -1 to 1 to convert to canvas height
   */
  relativeToAxis(value: number) {
    const halfHeight = this.canvas.height / 2
    return halfHeight * this.drawHeight.value * value + halfHeight
  }

  drawSynthFn(fn: SynthFn) {
    const arr = Float32Array.of(...Array(this.sampleSize.value).fill(0))
    fn(arr, 0, this.sampleRate)
    const step = this.canvas.width / arr.length
    this.ctx.strokeStyle = '#60a5fa'
    this.ctx.lineWidth = 4
    this.ctx.beginPath()
    this.drawArray([...arr], step)
    this.ctx.stroke()
  }

  drawArray(arr: Array<number>, step: number) {
    arr.forEach((v, i) => {
      if (i === arr.length - 1) return
      const currHeight = this.relativeToAxis(v)
      const nextHeight = this.relativeToAxis(arr[i + 1])
      this.line(step * i, currHeight, step * (i + 1), nextHeight)
    })
  }

  renderLoop() {
    super.renderLoop()
    if (this.fn.value)
      this.drawSynthFn(this.fn.value)
    this.drawAxes()
  }
}
