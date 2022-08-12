/*
  Принимаем на вход клавишу и 2 коллбека:
  - что делать, когда клавиша нажата
  - что делать, когда клавиша отжата
  плюс булеан на то, файрить ли ивент, когда клавиша нажата продолжительно или только один раз?
*/
type KeyboardEventHandler = (e: KeyboardEvent) => void

interface KeyboardEventConfig {
  code: KeyboardEvent['code']
  keydownCallback?: KeyboardEventHandler
  keyupCallback?: KeyboardEventHandler
  isContinuousKeydown?: boolean
}

const makeKeydownOnceCallback = (
  code: KeyboardEvent['code'],
  f: KeyboardEventHandler
): KeyboardEventHandler => {
  let pressed = false
  window.addEventListener('keyup', (e) => {
    if (e.code === code) {
      pressed = false
    }
  })
  return (e: KeyboardEvent) => {
    if (pressed) return
    pressed = true
    f(e)
  }
}

export class Keyboard {
  private keyboardConfigs: KeyboardEventConfig[]

  constructor() {
    this.keyboardConfigs = []

    window.addEventListener('keydown', (e) => {
      for (const { code, keydownCallback } of this.keyboardConfigs) {
        if (e.code !== code) {
          continue
        }

        keydownCallback?.(e)
      }
    })

    window.addEventListener('keyup', (e) => {
      for (const { code, keyupCallback } of this.keyboardConfigs) {
        if (e.code !== code) {
          continue
        }

        keyupCallback?.(e)
      }
    })
  }

  add(keyboardEventConfig: KeyboardEventConfig) {
    this.keyboardConfigs.push({
      ...keyboardEventConfig,
      keydownCallback:
        keyboardEventConfig.keydownCallback &&
        !keyboardEventConfig.isContinuousKeydown
          ? makeKeydownOnceCallback(
              keyboardEventConfig.code,
              keyboardEventConfig.keydownCallback
            )
          : keyboardEventConfig.keydownCallback,
    })
  }

  remove(keyboardEventConfig: KeyboardEventConfig) {
    this.keyboardConfigs = this.keyboardConfigs.filter(
      (config) => config !== keyboardEventConfig
    )
  }
}
