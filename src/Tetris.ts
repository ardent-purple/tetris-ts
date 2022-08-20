import { Clock } from './Clock.js'
import { Color, Display, getNextRandomColor, RenderPoint } from './Display.js'
import { Keyboard } from './Keyboard.js'
import { Options } from './Options.js'
import {
  getNextTetromino,
  getNextTetrominoRotation,
  Tetromino,
} from './tetrominoes.js'
import { scrambleArray } from './utils.js'

const GRID_WIDTH = 10 // cell count horizontal
const GRID_HEIGHT = 20 // cell count vertical

enum Direction {
  Left = 'left',
  Right = 'right',
}

const DEFAULT_COLOR = 'White'
const RANDOM_FILL_COUNT = 5

const initialTetrominoPosition = { x: 4, y: -1 }

export class Tetris {
  private scoreContainer: HTMLElement
  private display: Display
  private keyboard: Keyboard
  private clock: Clock

  private field: RenderPoint[] // current playing field, one to render
  private filledField: RenderPoint[] // field with filled cells

  private currentTetromino: Tetromino = getNextTetromino()
  private currentTetrominoPosition: RenderPoint = initialTetrominoPosition
  private currentTetrominoRotation: number = getNextTetrominoRotation(
    this.currentTetromino
  )
  private currentColor: Color = getNextRandomColor()

  private score = 0

  // options
  private pause = false
  private options: Options
  private colorOn: boolean = true
  private _difficulty: number = 0

  private isLastMove: boolean = false

  constructor(container: HTMLElement) {
    // score system
    this.scoreContainer = document.createElement('p')!
    this.scoreContainer.id = 'score'
    container.append(this.scoreContainer)
    this.renderScore()

    this.display = new Display(container, {
      cellWidth: GRID_WIDTH,
      cellHeight: GRID_HEIGHT,
      cellSize: 30,
    })
    this.keyboard = new Keyboard()
    this.clock = new Clock()

    this.field = []
    this.filledField = []

    this.options = new Options(this)

    this.clock.addRenderCallback(this.render.bind(this))

    // main game logic
    const mainGameLogicCallback = {
      callback: this.game.bind(this),
      interval: 250,
    }
    const strafeLeftCallback = {
      callback: this.strafeTetromino.bind(this, Direction.Left),
      interval: 150,
    }
    const strafeRightCallback = {
      callback: this.strafeTetromino.bind(this, Direction.Right),
      interval: 150,
    }
    const togglePauseCallback = () => {
      this.pause = !this.pause
      this.options.toggle()
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
    this.keyboard.add({
      code: 'KeyS',
      keydownCallback: this.pullFullTetromino.bind(this),
    })
    this.keyboard.add({
      code: 'Space',
      keydownCallback: togglePauseCallback,
    })

    this.restart()
    this.clock.start()
  }

  get currentTetrominoCoords() {
    return this.currentTetromino[this.currentTetrominoRotation]
  }

  get currentTetrominoAbsoluteCoords() {
    return this.currentTetrominoCoords.map((tetrominoeCoords) => ({
      x: tetrominoeCoords.x + this.currentTetrominoPosition.x,
      y: tetrominoeCoords.y + this.currentTetrominoPosition.y,
    }))
  }

  set difficulty(value: number) {
    const isValidValue = !isNaN(value) && value >= 0 && value <= 10
    this._difficulty = isValidValue ? value : 0
  }

  // game actions

  nextTetromino() {
    this.currentTetrominoPosition = initialTetrominoPosition
    this.currentTetromino = getNextTetromino()
    this.currentColor = this.colorOn ? getNextRandomColor() : DEFAULT_COLOR
    this.currentTetrominoRotation = getNextTetrominoRotation(
      this.currentTetromino
    )
  }

  strafeTetromino(direction: Direction) {
    if (this.pause || !this.checkCanStrafeTetromino(direction)) {
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
    if (this.pause || !this.checkCanRotateTetromino()) {
      return
    }

    this.currentTetrominoRotation = getNextTetrominoRotation(
      this.currentTetromino,
      this.currentTetrominoRotation
    )
  }

  saveTetromino() {
    this.filledField = [
      ...this.filledField,
      ...this.currentTetrominoAbsoluteCoords.map((coords) => ({
        ...coords,
        color: this.currentColor,
      })),
    ]
  }

  destroyFilledRows() {
    const allY = Array(GRID_HEIGHT)
      .fill(null)
      .map((_, index) => index)

    let destroyedRows = 0
    for (const row of allY) {
      const filledCellsAmount = this.filledField.filter(
        ({ y }) => y === row
      ).length
      if (filledCellsAmount !== GRID_WIDTH) {
        continue
      }

      destroyedRows++

      this.filledField = this.filledField
        .filter(({ y }) => y !== row)
        .map((coords) =>
          coords.y > row ? coords : { ...coords, y: coords.y + 1 }
        )
    }

    this.addScore(destroyedRows)
  }

  addScore(destroyedRows: number) {
    switch (destroyedRows) {
      case 1:
        this.score += 40
        break
      case 2:
        this.score += 100
        break
      case 3:
        this.score += 300
        break
      case 4:
        this.score += 1200
    }
  }

  pullFullTetromino() {
    if (this.pause) {
      return
    }

    while (this.checkCanPullTetromino()) {
      this.pullTetromino()
    }
  }

  // control options logic

  restart() {
    this.score = 0
    this.renderScore()
    this.#cleanField()
    this.#fillField()
    this.nextTetromino()
  }

  #cleanField() {
    this.filledField = []
    this.field = []
  }

  #fillField() {
    for (let i = 0; i < this._difficulty; i++) {
      this.#fillRow(GRID_HEIGHT - 1 - i)
    }
  }

  #fillRow(row: number) {
    const generated: boolean[] = Array(GRID_WIDTH).fill(false)

    let filledAmount = 0
    let current = -1
    let filledStreak = 0
    while (filledAmount < RANDOM_FILL_COUNT) {
      current = (current + 1) % GRID_WIDTH

      if (generated[current]) {
        continue
      }
      const fillingHere = filledStreak < 2 && Math.random() > 0.5
      if (fillingHere) {
        generated[current] = true
        filledStreak++
        filledAmount++
      } else {
        filledStreak = 0
      }
    }

    const filtered = generated
      .map((e, i) => [e, i])
      .filter(([e]) => e)
      .map(([, i]) => i as number)

    this.filledField = this.filledField.concat(
      filtered.map((x: number) => ({
        x,
        y: row,
        color: getNextRandomColor(),
      }))
    )
  }

  switchColor(isColorOn: boolean) {
    this.colorOn = isColorOn
    if (isColorOn) {
      this.currentColor = getNextRandomColor()
      this.filledField = this.filledField.map((coords) => ({
        ...coords,
        color: getNextRandomColor(),
      }))
    } else {
      this.currentColor = DEFAULT_COLOR
      this.filledField = this.filledField.map((coords) => ({
        ...coords,
        color: DEFAULT_COLOR,
      }))
    }
  }

  // game checks

  checkCanPullTetromino() {
    // find min y in tetromino
    const potentialPullAbsoluteCoords = this.currentTetrominoAbsoluteCoords.map(
      (coords) => ({ ...coords, y: coords.y + 1 })
    )

    return !potentialPullAbsoluteCoords.some(
      ({ x, y }) =>
        y >= GRID_HEIGHT ||
        this.filledField.some(
          ({ x: filledX, y: filledY }) => x === filledX && filledY === y
        )
    )
  }

  checkCanStrafeTetromino(direction: Direction) {
    switch (direction) {
      case Direction.Left:
        const potentialStrafeLeftCoords =
          this.currentTetrominoAbsoluteCoords.map((coords) => ({
            ...coords,
            x: coords.x - 1,
          }))
        return !potentialStrafeLeftCoords.some(
          ({ x, y }) =>
            x < 0 ||
            this.filledField.some(
              ({ x: filledX, y: filledY }) => x === filledX && filledY === y
            )
        )
      case Direction.Right:
        const potentialStrafeRightCoords =
          this.currentTetrominoAbsoluteCoords.map((coords) => ({
            ...coords,
            x: coords.x + 1,
          }))
        return !potentialStrafeRightCoords.some(
          ({ x, y }) =>
            x >= GRID_WIDTH ||
            this.filledField.some(
              ({ x: filledX, y: filledY }) => x === filledX && filledY === y
            )
        )
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

    return (
      maxY < GRID_HEIGHT &&
      minX >= 0 &&
      maxX < GRID_WIDTH &&
      potentialTetrominoCoords.every(
        ({ x, y }) =>
          !this.filledField.some(
            ({ x: filledX, y: filledY }) => filledX === x && filledY === y
          )
      )
    )
  }

  game() {
    if (this.pause) {
      return
    }
    this.field = [
      ...this.filledField,
      ...this.currentTetrominoAbsoluteCoords.map((coords) => ({
        ...coords,
        color: this.currentColor,
      })),
    ]

    // test
    // maybe separate pull logic?
    if (this.checkCanPullTetromino()) {
      this.isLastMove = false
      this.pullTetromino()
      return
    }

    if (!this.isLastMove) {
      this.isLastMove = true
    } else {
      this.isLastMove = false
      this.saveTetromino()
      this.destroyFilledRows()
      this.renderScore()
      this.nextTetromino()
    }
  }

  render() {
    this.display.render(this.field)
  }

  renderScore() {
    this.scoreContainer.textContent = this.score.toString()
  }
}
