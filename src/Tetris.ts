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

enum Direction {
  Left = 'left',
  Right = 'right',
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
      cellSize: 30,
    })
    this.keyboard = new Keyboard()
    this.clock = new Clock()

    this.field = []

    this.clock.addRenderCallback(this.render.bind(this))

    // main game logic
    const mainGameLogicCallback = {
      callback: this.game.bind(this),
      interval: 250,
    }
    const strafeLeftCallback = {
      callback: this.strafeTetromino.bind(this, Direction.Left),
      interval: 100,
    }
    const strafeRightCallback = {
      callback: this.strafeTetromino.bind(this, Direction.Right),
      interval: 100,
    }

    this.clock.addLogicCallback(mainGameLogicCallback)

    // keyboard bindings
    this.keyboard.add({
      code: 'KeyA',
      keydownCallback: () => {
        this.strafeTetromino.bind(this, Direction.Left)
        this.clock.addLogicCallback(strafeLeftCallback)
      },
      keyupCallback: () => {
        this.clock.removeLogicCallback(strafeLeftCallback)
      },
    })
    this.keyboard.add({
      code: 'KeyD',
      keydownCallback: () => {
        this.strafeTetromino.bind(this, Direction.Right)
        this.clock.addLogicCallback(strafeRightCallback)
      },
      keyupCallback: () => {
        this.clock.removeLogicCallback(strafeRightCallback)
      },
    })
    this.keyboard.add({
      code: 'KeyW',
      keydownCallback: this.rotateTetromino.bind(this),
    })

    this.clock.start()
  }

  get currentTetrominoCoords() {
    return this.currentTetromino[this.currentTetrominoRotation]
  }

  // game actions

  nextTetromino() {
    this.currentTetrominoPosition = { x: 4, y: -1 }
    this.currentTetromino = getNextTetromino()
    this.currentTetrominoRotation = getNextTetrominoRotation(
      this.currentTetromino
    )
  }

  strafeTetromino(direction: Direction) {
    if (!this.checkCanStrafeTetromino(direction)) {
      return
    }

    const nextX =
      this.currentTetrominoPosition.x + (direction === Direction.Left ? -1 : 1)
    this.currentTetrominoPosition = {
      ...this.currentTetrominoPosition,
      x: nextX,
    }
  }

  // pulls tetromino down
  pullTetromino() {
    this.currentTetrominoPosition = {
      ...this.currentTetrominoPosition,
      y: this.currentTetrominoPosition.y + 1,
    }
  }

  rotateTetromino() {
    if (!this.checkCanRotateTetromino()) {
      return
    }

    this.currentTetrominoRotation = getNextTetrominoRotation(
      this.currentTetromino,
      this.currentTetrominoRotation
    )
  }

  // game checks

  checkCanPullTetromino() {
    // find min y in tetromino
    const maxYInTetromino = Math.max(
      ...this.currentTetrominoCoords.map(
        (coords) => coords.y + this.currentTetrominoPosition.y
      )
    )

    return maxYInTetromino + 1 < GRID_HEIGHT
  }

  checkCanStrafeTetromino(direction: Direction) {
    const allTetrominoXCoords = this.currentTetrominoCoords.map(
      (coords) => coords.x + this.currentTetrominoPosition.x
    )
    switch (direction) {
      case Direction.Left:
        const minXInTetromino = Math.min(...allTetrominoXCoords)
        return minXInTetromino > 0
      case Direction.Right:
        const maxXInTetromino = Math.max(...allTetrominoXCoords)
        return maxXInTetromino < GRID_WIDTH - 1
    }
  }

  checkCanRotateTetromino() {
    const potentialTetrominoRotation = getNextTetrominoRotation(
      this.currentTetromino,
      this.currentTetrominoRotation
    )
    const potentialTetrominoCoords = this.currentTetromino[
      potentialTetrominoRotation
    ].map((coords) => ({
      x: coords.x + this.currentTetrominoPosition.x,
      y: coords.y + this.currentTetrominoPosition.y,
    }))
    const x = potentialTetrominoCoords.map(({ x }) => x)
    const y = potentialTetrominoCoords.map(({ y }) => y)

    const maxY = Math.max(...y)
    const minX = Math.min(...x)
    const maxX = Math.max(...x)

    return maxY < GRID_HEIGHT && minX >= 0 && maxX < GRID_WIDTH
  }

  game() {
    this.field = [
      ...this.currentTetrominoCoords.map((tetrominoeCoords) => ({
        x: tetrominoeCoords.x + this.currentTetrominoPosition.x,
        y: tetrominoeCoords.y + this.currentTetrominoPosition.y,
      })),
    ]

    // test
    // maybe separate pull logic?
    if (this.checkCanPullTetromino()) {
      this.pullTetromino()
    } else {
      this.nextTetromino()
    }
  }

  render() {
    this.display.render(this.field)
  }
}
