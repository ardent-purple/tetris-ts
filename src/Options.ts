import { Tetris } from './Tetris.js'

const SCORE_KEY = 'tetris:score'
const MAX_SCORES = 5

interface ScoreRecord {
  datetime: Date
  score: number
}

export class Options {
  // HTML
  private wrapper: HTMLElement
  private restartButton: HTMLElement
  private colorControlCheckbox: HTMLInputElement
  private speedControlCheckbox: HTMLInputElement
  private difficultyNumberInput: HTMLInputElement
  private saveButton: HTMLButtonElement
  private loadButton: HTMLButtonElement
  private scoreContainer: HTMLElement

  private game: Tetris
  private scores: ScoreRecord[]

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

    this.scoreContainer = document.querySelector('.score-container')!

    this.scores = []
    const toLoad = localStorage.getItem(SCORE_KEY)
    if (toLoad) {
      const toLoadArray = JSON.parse(toLoad)
      for (const scoreRecord of toLoadArray) {
        this.scores.push({
          datetime: new Date(scoreRecord.datetime),
          score: scoreRecord.score,
        })
      }
    }
    this.#renderScore()
  }

  toggle() {
    this.wrapper.classList.toggle('show')
  }

  addScore(newScore: number) {
    const newScoreRecord = {
      datetime: new Date(),
      score: newScore,
    }
    this.scores.push(newScoreRecord)
    this.scores.sort(({ score: score1 }, { score: score2 }) => score2 - score1)

    if (this.scores.length > MAX_SCORES) {
      const minScore = Math.min(...this.scores.map(({ score }) => score))
      const minIndex = this.scores.findIndex(({ score }) => minScore === score)
      this.scores.splice(minIndex, 1)
    }
    console.log(this.scores)

    this.#saveScore()
    this.#renderScore()
  }

  #saveScore() {
    localStorage.setItem(SCORE_KEY, JSON.stringify(this.scores))
  }

  #renderScore() {
    this.scoreContainer.innerHTML = ''

    for (const { datetime, score } of this.scores) {
      const html = `<tr><td>${formatDatetime(
        datetime
      )}</td><td>${score}</td></tr>`
      this.scoreContainer.insertAdjacentHTML('beforeend', html)
    }
  }
}

function formatDatetime(datetime: Date) {
  return `${datetime.getFullYear()}-${prefix(datetime.getMonth() + 1)}-${prefix(
    datetime.getDate()
  )} ${prefix(datetime.getHours())}:${prefix(datetime.getMinutes())}:${prefix(
    datetime.getSeconds()
  )}`
}

function prefix(num: number) {
  return `0${num}`.slice(-2)
}
