import { GRID_WIDTH, GRID_HEIGHT } from './constants.js'
import {
  getNextTetromino,
  getNextTetrominoRotation,
  tetrominoes,
} from './tetrominoes.js'
import { Display } from './Display.js'

const display = new Display(document.getElementById('root')!, {
  cellSize: 20,
  cellGap: 3,
})

let tetromino = getNextTetromino()
let rotIndex = 0

window.addEventListener('click', () => {
  tetromino = getNextTetromino()
  rotIndex = getNextTetrominoRotation(tetromino)
})

setInterval(() => {
  const tetra = tetromino[rotIndex]
  rotIndex = getNextTetrominoRotation(tetromino, rotIndex)

  const points = tetra.map(({ x, y }) => ({
    x: x + 2,
    y: y + 5,
  }))

  display.render(points)
}, 400)
