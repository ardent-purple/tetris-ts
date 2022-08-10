// tetrominoes
// legend:
// ! - base filled space
// * - filled space
// 0 -- base empty space
// _ empty space

/*
0.
  **
  !*
*/

const SQUARE = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
]

/*
0.
  *!**
1.
  *
  *
  !
  *
*/
const LINE = [
  [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],
  [
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 0, y: -1 },
  ],
]

/*
0.
  _*_
  *!*
1.
  *_
  !*
  *_
2.
  *!*
  _*_
3.
  _*
  *!
  _*
 */
const T = [
  [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ],
]

/*
0.
  *_
  !_
  **
1.
  *!*
  *__
2.
  **
  _!
  _*
3.
  __*
  *!*

 */
const L = [
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
  ],
  [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ],
]

/*
0.
  _*
  _!
  **
1.
  *__
  *!*
2.
  **
  !_
  *_
3.
  *!*
  __*
 */
const J = [
  [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
  ],
  [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
]

/*
0.
  *_
  !*
  _*
1.
  _!*
  **_
*/
const S = [
  [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
  ],
]

/*
0.
  _*
  !*
  *_
1.
  *!_
  _**
 */
const Z = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
  ],
  [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
]

export const tetrominoes = [SQUARE, LINE, T, L, J, S, Z] as const

export const getNextTetromino = () =>
  tetrominoes[Math.floor(Math.random() * tetrominoes.length)]

export const getNextTetrominoRotation = (
  tetromino: typeof tetrominoes[number],
  currentRot: number = -1
) => {
  return (currentRot + 1) % tetromino.length
}
