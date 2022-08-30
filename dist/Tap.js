export class Tap {
    topTapCallbacks = [];
    bottomTapCallbacks = [];
    constructor() {
        window.addEventListener('click', (e) => {
            const windowHeightHalf = window.innerHeight / 2;
            const cbs = windowHeightHalf > e.clientY
                ? this.topTapCallbacks
                : this.bottomTapCallbacks;
            for (const cb of cbs) {
                cb();
            }
        });
    }
    addTopTapCallback(cb) {
        this.topTapCallbacks.push(cb);
    }
    addBottomTapCallback(cb) {
        this.bottomTapCallbacks.push(cb);
    }
    removeTopTapCallback(cb) {
        this.topTapCallbacks = this.topTapCallbacks.filter((existingCb) => existingCb !== cb);
    }
    removeBottomTapCallback(cb) {
        this.bottomTapCallbacks = this.bottomTapCallbacks.filter((existingCb) => existingCb !== cb);
    }
}
