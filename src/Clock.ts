type ClockCallback = () => void

interface ClockCallbackInterval {
  callback: ClockCallback
  interval: number
}

export class Clock {
  private renderCallbacks: ClockCallback[]
  private logicCallbacks: (ClockCallbackInterval & { last?: number })[]

  constructor() {
    this.renderCallbacks = []
    this.logicCallbacks = []
  }

  start() {
    window.requestAnimationFrame(this.render.bind(this))
  }

  render(timestamp: DOMHighResTimeStamp) {
    for (const logicCallback of this.logicCallbacks) {
      if (
        !logicCallback.last ||
        timestamp - logicCallback.last > logicCallback.interval
      ) {
        logicCallback.callback()
        logicCallback.last = timestamp
      }
    }

    for (const renderCallback of this.renderCallbacks) {
      renderCallback()
    }

    window.requestAnimationFrame(this.render.bind(this))
  }

  addRenderCallback(renderCallback: ClockCallback) {
    this.renderCallbacks.push(renderCallback)
  }

  removeRenderCallback(renderCallback: ClockCallback) {
    this.renderCallbacks = this.renderCallbacks.filter(
      (callback) => callback !== renderCallback
    )
  }

  addLogicCallback(logicCallback: ClockCallbackInterval) {
    this.logicCallbacks.push(logicCallback)
  }

  removeLogicCallback(logicCallback: ClockCallbackInterval) {
    this.logicCallbacks = this.logicCallbacks.filter(
      (existingLogicCallback) => existingLogicCallback !== logicCallback
    )
  }

  timeout(f: ClockCallback, interval: number) {
    const timeout = setTimeout(f, interval)
    return () => {
      clearTimeout(timeout)
    }
  }
}
