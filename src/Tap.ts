type Callback = () => void

export class Tap {
  private topTapCallbacks: Callback[] = []
  private bottomTapCallbacks: Callback[] = []

  constructor() {
    window.addEventListener('click', (e) => {
      const windowHeightHalf = window.innerHeight / 2
      const cbs =
        windowHeightHalf > e.clientY
          ? this.topTapCallbacks
          : this.bottomTapCallbacks
      for (const cb of cbs) {
        cb()
      }
    })
  }

  addTopTapCallback(cb: Callback) {
    this.topTapCallbacks.push(cb)
  }

  addBottomTapCallback(cb: Callback) {
    this.bottomTapCallbacks.push(cb)
  }

  removeTopTapCallback(cb: Callback) {
    this.topTapCallbacks = this.topTapCallbacks.filter(
      (existingCb) => existingCb !== cb
    )
  }

  removeBottomTapCallback(cb: Callback) {
    this.bottomTapCallbacks = this.bottomTapCallbacks.filter(
      (existingCb) => existingCb !== cb
    )
  }
}
