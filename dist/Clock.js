export class Clock {
    renderCallbacks;
    logicCallbacks;
    constructor() {
        this.renderCallbacks = [];
        this.logicCallbacks = [];
    }
    start() {
        window.requestAnimationFrame(this.render.bind(this));
    }
    render(timestamp) {
        for (const logicCallback of this.logicCallbacks) {
            if (!logicCallback.last ||
                timestamp - logicCallback.last > logicCallback.interval) {
                logicCallback.callback();
                logicCallback.last = timestamp;
            }
        }
        for (const renderCallback of this.renderCallbacks) {
            renderCallback();
        }
        window.requestAnimationFrame(this.render.bind(this));
    }
    addRenderCallback(renderCallback) {
        this.renderCallbacks.push(renderCallback);
    }
    removeRenderCallback(renderCallback) {
        this.renderCallbacks = this.renderCallbacks.filter((callback) => callback !== renderCallback);
    }
    addLogicCallback(logicCallback) {
        this.logicCallbacks.push(logicCallback);
    }
    removeLogicCallback(logicCallback) {
        this.logicCallbacks = this.logicCallbacks.filter((existingLogicCallback) => existingLogicCallback !== logicCallback);
    }
    timeout(f, interval) {
        const timeout = setTimeout(f, interval);
        return () => {
            clearTimeout(timeout);
        };
    }
}
