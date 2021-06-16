import { Ref, watch } from 'vue'
import { Complex } from './fft'
import { CanvasRenderer } from './renderer'
import { sampleRate } from './sampleRate'

export class FrequencyViewer extends CanvasRenderer {
  fourierArr: Ref<Complex[]>

  constructor(
    ctx: CanvasRenderingContext2D,
    fourierArr: Ref<Complex[]>,
  ) {
    super(ctx)
    this.fourierArr = fourierArr
    watch(fourierArr, () => this.rerender())
  }

  offset(x: number, y: number): {x: number; y: number} {
    return {
      x: x / 10,
      y: this.canvas.height - y,
    }
  }

  drawFFT() {
    const arr = this.fourierArr.value
    const renderArr = arr.slice(0, Math.ceil(arr.length / 2))
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.beginPath()
    let previousPoint = { x: 0, y: 0 }
    renderArr.forEach((v, i) => {
      const frequency = (i * (sampleRate / 2)) / (arr.length / 2)
      const magnitude = Math.sqrt(v.r * v.r + v.i * v.i)

      const p1 = this.offset(frequency, magnitude)
      const p0 = this.offset(previousPoint.x, previousPoint.y)

      if (previousPoint)
        this.line(p0.x, p0.y, p1.x, p1.y)

      previousPoint = { x: frequency, y: magnitude }
    })
    this.ctx.stroke()
  }

  renderLoop() {
    super.renderLoop()
    this.drawFFT()
  }
}
