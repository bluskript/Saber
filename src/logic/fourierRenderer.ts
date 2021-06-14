import { Ref } from 'vue'
import { fft } from './fft'
import { CanvasRenderer } from './renderer'
import { SynthFn } from './synth'

export class FourierRenderer extends CanvasRenderer {
  fn: Ref<SynthFn | undefined>
  drawScale: Ref<number>
  offsetX = 0
  offsetY = 0
  dragging = false

  constructor(ctx: CanvasRenderingContext2D, fn: Ref<SynthFn | undefined>, drawScale: Ref<number>) {
    super(ctx)
    this.fn = fn
    this.drawScale = drawScale
    this.canvas.width = 512
    this.canvas.height = 128
    this.canvas.onwheel = ev => this.onWheel(ev)
    this.canvas.onmousedown = () => this.dragging = true
    this.canvas.onmouseup = () => this.dragging = false
    this.canvas.onmousemove = (ev) => {
      if (this.dragging) this.onPan(ev)
    }
  }

  onWheel(ev: WheelEvent) {
    ev.preventDefault()
    this.drawScale.value *= Math.exp(-ev.deltaY / 500)
  }

  onPan(ev: MouseEvent) {
    ev.preventDefault()
    this.offsetX += ev.movementX
    this.offsetY += ev.movementY
  }

  centered(x: number, y: number): { x: number; y: number } {
    x += this.offsetX / this.drawScale.value
    y += this.offsetY / this.drawScale.value
    return {
      x: (x * this.drawScale.value) + this.canvas.width / 2,
      y: (y * this.drawScale.value) + this.canvas.height / 2,
    }
  }

  drawFFT(fn: SynthFn) {
    const arr = Float32Array.of(...Array(512).fill(0))
    fn(arr, 0, 44100)
    this.ctx.strokeStyle = '#4ADE80'
    const renderArr = fft([...arr])
    this.ctx.beginPath()
    renderArr.forEach((v, i) => {
      if (i === arr.length - 1) return
      const currPt = renderArr[i]
      const nextPt = renderArr[i + 1]
      const { x, y } = this.centered(currPt.r, currPt.i)
      const { x: nextX, y: nextY } = this.centered(nextPt.r, nextPt.i)
      this.line(
        x,
        y,
        nextX,
        nextY,
      )
    })
    this.ctx.stroke()
  }

  renderLoop() {
    super.renderLoop()
    if (this.fn.value)
      this.drawFFT(this.fn.value)
  }
}
