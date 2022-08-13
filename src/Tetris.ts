import { Clock } from './Clock.js'
import { Display } from './Display.js'
import { Keyboard } from './Keyboard.js'
import {
  tetrominoes,
  getNextTetromino,
  getNextTetrominoRotation,
  Tetromino,
} from './tetrominoes.js'

const GRID_WIDTH = 10 // cell count horizontal
const GRID_HEIGHT = 20 // cell count vertical

interface Position {
  x: number
  y: number
}

const initialTetrominoPosition = { x: 4, y: -1 }

export class Tetris {
  private display: Display
  private keyboard: Keyboard
  private clock: Clock

  private field: Position[]

  private currentTetromino: Tetromino = getNextTetromino()
  private currentTetrominoPosition: Position = initialTetrominoPosition
  private currentTetrominoRotation: number = getNextTetrominoRotation(
    this.currentTetromino
  )

  constructor(container: HTMLElement) {
    this.display = new Display(container, {
      cellWidth: GRID_WIDTH,
      cellHeight: GRID_HEIGHT,
    })
    this.keyboard = new Keyboard()
    this.clock = new Clock()

    this.field = []

    this.clock.addRenderCallback(this.render.bind(this))
    const gameLogicCallback = {
      callback: this.game.bind(this),
      interval: 250,
    }
    this.clock.addLogicCallback(gameLogicCallback)
    this.clock.start()

    // test
    this.keyboard.add({
      code: 'KeyW',
      keydownCallback: () => {
        gameLogicCallback.interval += 50
      },
    })
    this.keyboard.add({
      code: 'KeyS',
      keydownCallback: () => {
        gameLogicCallback.interval -= 50
      },
    })
  }

  nextTetromino() {
    this.currentTetrominoPosition = { x: 4, y: -1 }
    this.currentTetromino = getNextTetromino()
    this.currentTetrominoRotation = getNextTetrominoRotation(
      this.currentTetromino
    )
  }

  get currentTetrominoCoords() {
    return this.currentTetromino[this.currentTetrominoRotation]
  }

  checkCanMoveTetrominoDown() {
    // find min y in tetromino
    const maxYInTetromino = Math.max(
      ...this.currentTetrominoCoords.map(
        (coords) => coords.y + this.currentTetrominoPosition.y
      )
    )

    return maxYInTetromino + 1 < GRID_HEIGHT
  }

  game() {
    this.field = [
      ...this.currentTetrominoCoords.map((tetrominoeCoords) => ({
        x: tetrominoeCoords.x + this.currentTetrominoPosition.x,
        y: tetrominoeCoords.y + this.currentTetrominoPosition.y,
      })),
    ]

    if (this.checkCanMoveTetrominoDown()) {
      this.currentTetrominoPosition = {
        ...this.currentTetrominoPosition,
        y: this.currentTetrominoPosition.y + 1,
      }
    } else {
      this.nextTetromino()
    }
  }

  render() {
    this.display.render(this.field)
  }
}
