import { Tetris } from './Tetris.js'

export class Options {
  // HTML
  private wrapper: HTMLElement
  private restartButton: HTMLElement

  private game: Tetris

  constructor(game: Tetris) {
    this.game = game

    this.wrapper = document.querySelector('.options-wrapper')!

    this.restartButton = this.wrapper.querySelector('.restart')!
    this.restartButton.addEventListener('click', () => {
      this.game.restart()
    })
  }

  toggle() {
    this.wrapper.classList.toggle('show')
  }
}
