import { GRID_WIDTH, GRID_HEIGHT } from './constants.js'
import { Display } from './Display.js'

const display = new Display(document.getElementById('root')!, {
  cellSize: 20,
  cellGap: 3,
})
setInterval(() => {
  const size = 100
  const points = Array(size)
    .fill(null)
    .map(() => {
      const x = Math.floor(Math.random() * GRID_WIDTH)
      const y = Math.floor(Math.random() * GRID_HEIGHT)
      return { x, y }
    })

  display.render(points)
}, 400)
