import { GRID_WIDTH, GRID_HEIGHT } from './constants.js'
import {
  getNextTetromino,
  getNextTetrominoRotation,
  tetrominoes,
} from './tetrominoes.js'
import { Display } from './Display.js'
import { Clock } from './Clock.js'
import { Keyboard } from './Keyboard.js'

const display = new Display(document.getElementById('root')!, {
  cellHeight: 30,
  cellWidth: 20,
  cellSize: 20,
  cellGap: 3,
})

let tetromino = getNextTetromino()
let rotIndex = 0
let rotatedTetromino = tetromino[rotIndex]

const clock = new Clock()

clock.addLogicCallback({
  callback: () => {
    tetromino = getNextTetromino()
    rotIndex = getNextTetrominoRotation(tetromino)
  },
  interval: 1000,
})

clock.addLogicCallback({
  callback: () => {
    rotIndex = getNextTetrominoRotation(tetromino, rotIndex)
    rotatedTetromino = tetromino[rotIndex]
  },
  interval: 200,
})

clock.addRenderCallback(() => {
  const points = rotatedTetromino.map(({ x, y }) => ({
    x: x + 2,
    y: y + 5,
  }))

  display.render(points)
})

clock.start()

// keyboard test

const keyboard = new Keyboard()

keyboard.add({
  code: 'KeyA',
  keydownCallback: (e) => console.log('AAAAAA'),
})
keyboard.add({
  code: 'KeyW',
  keydownCallback: (e) => console.log('WWWWWWW'),
  isContinuousKeydown: true,
})
keyboard.add({
  code: 'KeyD',
  keyupCallback: (e) => console.log('ddddddd'),
})
keyboard.add({
  code: 'KeyS',
  keydownCallback: (e) => console.log('s down'),
  keyupCallback: (e) => console.log('s up'),
})
