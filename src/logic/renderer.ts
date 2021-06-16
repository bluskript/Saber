import debounce from 'debounce'

export class CanvasRenderer {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement

  constructor(
    ctx: CanvasRenderingContext2D,
  ) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    window.addEventListener('resize', debounce(() => {
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
      requestAnimationFrame(() => this.renderLoop())
    }, 200), { passive: true })

    requestAnimationFrame(() => this.renderLoop())
  }

  point(x: number, y: number, color: string) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, 3, 3)
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.moveTo(x1 + 0.5, y1 + 0.5)
    this.ctx.lineTo(x2 + 0.5, y2 + 0.5)
  }

  rerender() {
    requestAnimationFrame(() => this.renderLoop())
  }

  renderLoop() {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
