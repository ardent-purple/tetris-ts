// amount of pixels to register swipe
const X_DIFF_TRESSHOLD = 70;
export class Swipes {
    swipeLeftCallbacks = [];
    swipeRightCallbacks = [];
    swipeStartCoords = null;
    constructor() {
        window.addEventListener('touchstart', (e) => {
            if (!e.touches.length) {
                return;
            }
            const touch = e.touches[0];
            this.swipeStartCoords = {
                x: touch.clientX,
            };
        });
        window.addEventListener('touchend', (e) => {
            if (!this.swipeStartCoords) {
                return;
            }
            const { x: startX } = this.swipeStartCoords;
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;
            const sign = Math.sign(diff);
            if (Math.abs(diff) > X_DIFF_TRESSHOLD) {
                const cbs = sign < 0 ? this.swipeLeftCallbacks : this.swipeRightCallbacks;
                for (const cb of cbs) {
                    cb();
                }
            }
            this.swipeStartCoords = null;
        });
    }
    addSwipeLeftCallback(cb) {
        this.swipeLeftCallbacks.push(cb);
    }
    addSwipeRightCallback(cb) {
        this.swipeRightCallbacks.push(cb);
    }
    removeSwipeLeftCallback(cb) {
        this.swipeLeftCallbacks = this.swipeLeftCallbacks.filter((existingCb) => existingCb !== cb);
    }
    removeSwipeRightCallback(cb) {
        this.swipeRightCallbacks = this.swipeRightCallbacks.filter((existingCb) => existingCb !== cb);
    }
}
