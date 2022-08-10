import { GRID_WIDTH, GRID_HEIGHT, tetrominoes } from './constants.js'
import { Display } from './Display.js'

const display = new Display(document.getElementById('root')!, {
  cellSize: 20,
  cellGap: 3,
})

let tetraIndex = 0
let rotIndex = 0
window.addEventListener('click', () => {
  tetraIndex = (tetraIndex + 1) % tetrominoes.length
  rotIndex = 0
})

setInterval(() => {
  rotIndex = (rotIndex + 1) % tetrominoes[tetraIndex].length
  const tetra = tetrominoes[tetraIndex][rotIndex]
  const points = tetra.map(({ x, y }) => ({
    x: x + 2,
    y: y + 5,
  }))

  display.render(points)
}, 400)
