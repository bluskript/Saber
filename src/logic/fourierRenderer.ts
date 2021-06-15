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
    this.canvas.addEventListener('wheel', ev => this.onWheel(ev))
    this.canvas.addEventListener('mousedown', () => this.dragging = true)
    window.addEventListener('mouseup', () => this.dragging = false)
    this.canvas.addEventListener('mousemove', (ev) => {
      if (this.dragging) this.onPan(ev)
    })
  }

  onWheel(ev: WheelEvent) {
    ev.preventDefault()
    const delta = Math.exp(-ev.deltaY / 500)

    const x = ev.offsetX
    const y = ev.offsetY
    const centeredX = x - this.canvas.width / 2
    const centeredY = y - this.canvas.height / 2
    this.offsetX += centeredX
    this.offsetY += centeredY
    this.drawScale.value *= delta
    this.offsetX -= centeredX * delta
    this.offsetY -= centeredY * delta
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
    const center = this.centered(0, 0)
    this.point(center.x, center.y, '#ffffff')
  }
}
