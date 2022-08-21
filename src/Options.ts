import { Tetris } from './Tetris.js'

export class Options {
  // HTML
  private wrapper: HTMLElement
  private restartButton: HTMLElement
  private colorControlCheckbox: HTMLInputElement
  private speedControlCheckbox: HTMLInputElement
  private difficultyNumberInput: HTMLInputElement
  private saveButton: HTMLButtonElement
  private loadButton: HTMLButtonElement

  private game: Tetris

  constructor(game: Tetris) {
    this.game = game

    this.wrapper = document.querySelector('.options-wrapper')!

    this.restartButton = this.wrapper.querySelector('.restart')!
    this.restartButton.addEventListener('click', () => {
      this.game.restart()
    })

    this.colorControlCheckbox = this.wrapper.querySelector('.color-control')!
    this.colorControlCheckbox.addEventListener('change', () => {
      const checked = this.colorControlCheckbox.checked
      this.game.switchColor(checked)
    })

    this.speedControlCheckbox = this.wrapper.querySelector('.speed-control')!
    this.speedControlCheckbox.addEventListener('change', () => {
      this.game.isSpeedChanging = this.speedControlCheckbox.checked
    })

    this.difficultyNumberInput =
      this.wrapper.querySelector('.difficulty-number')!

    this.difficultyNumberInput.addEventListener('change', () => {
      const value = Number(this.difficultyNumberInput.value)

      this.game.difficulty = value
    })

    this.saveButton = document.querySelector('.save')!
    this.saveButton.addEventListener('click', () => {
      console.log('save')

      this.game.save()
    })

    this.loadButton = document.querySelector('.load')!
    this.loadButton.addEventListener('click', () => {
      console.log('load')

      this.game.load()
    })
  }

  toggle() {
    this.wrapper.classList.toggle('show')
  }
}
