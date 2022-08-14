const makeKeydownOnceCallback = (code, f) => {
    let pressed = false;
    window.addEventListener('keyup', (e) => {
        if (e.code === code) {
            pressed = false;
        }
    });
    return (e) => {
        if (pressed)
            return;
        pressed = true;
        f(e);
    };
};
export class Keyboard {
    keyboardConfigs;
    constructor() {
        this.keyboardConfigs = [];
        window.addEventListener('keydown', (e) => {
            for (const { code, keydownCallback } of this.keyboardConfigs) {
                if (e.code !== code) {
                    continue;
                }
                keydownCallback?.(e);
            }
        });
        window.addEventListener('keyup', (e) => {
            for (const { code, keyupCallback } of this.keyboardConfigs) {
                if (e.code !== code) {
                    continue;
                }
                keyupCallback?.(e);
            }
        });
    }
    add(keyboardEventConfig) {
        this.keyboardConfigs.push({
            ...keyboardEventConfig,
            keydownCallback: keyboardEventConfig.keydownCallback &&
                !keyboardEventConfig.isContinuousKeydown
                ? makeKeydownOnceCallback(keyboardEventConfig.code, keyboardEventConfig.keydownCallback)
                : keyboardEventConfig.keydownCallback,
        });
    }
    remove(keyboardEventConfig) {
        this.keyboardConfigs = this.keyboardConfigs.filter((config) => config !== keyboardEventConfig);
    }
}
