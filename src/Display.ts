import { GRID_HEIGHT, GRID_WIDTH } from './constants.js'

interface DisplayOptions {
  cellHeight: number
  cellWidth: number
  cellSize: number
  cellGap: number
  emptyColor: CanvasFillStrokeStyles['fillStyle']
  filledColor: CanvasFillStrokeStyles['fillStyle']
}

const defaultOptions: DisplayOptions = {
  cellHeight: GRID_HEIGHT,
  cellWidth: GRID_WIDTH,
  cellSize: 15,
  cellGap: 2,
  emptyColor: 'black',
  filledColor: 'white',
}

interface RenderPoint {
  x: number
  y: number
}

export class Display {
  private canvas: HTMLCanvasElement
  private ctx2d: CanvasRenderingContext2D
  private options: DisplayOptions

  constructor(container: HTMLElement, options: Partial<DisplayOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    }

    this.canvas = document.createElement('canvas')
    container.append(this.canvas)

    this.canvas.width =
      this.options.cellWidth * this.options.cellSize +
      (this.options.cellWidth + 1) * this.options.cellGap
    this.canvas.height =
      this.options.cellHeight * this.options.cellSize +
      (this.options.cellHeight + 1) * this.options.cellGap

    this.ctx2d = this.canvas.getContext('2d')!
  }

  render(points: RenderPoint[]) {
    // clear the screen
    this.clear()

    // fill the dots
    this.ctx2d.fillStyle = this.options.filledColor
    for (const { x, y } of points) {
      this.ctx2d.fillRect(
        (1 + x) * this.options.cellGap + x * this.options.cellSize,
        (1 + y) * this.options.cellGap + y * this.options.cellSize,
        this.options.cellSize,
        this.options.cellSize
      )
    }
  }

  clear() {
    this.ctx2d.fillStyle = this.options.emptyColor
    this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
