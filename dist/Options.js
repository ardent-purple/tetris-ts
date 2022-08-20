export class Options {
    // HTML
    wrapper;
    restartButton;
    colorControlCheckbox;
    speedControlCheckbox;
    difficultyNumberInput;
    game;
    constructor(game) {
        this.game = game;
        this.wrapper = document.querySelector('.options-wrapper');
        this.restartButton = this.wrapper.querySelector('.restart');
        this.restartButton.addEventListener('click', () => {
            this.game.restart();
        });
        this.colorControlCheckbox = this.wrapper.querySelector('.color-control');
        this.colorControlCheckbox.addEventListener('change', () => {
            const checked = this.colorControlCheckbox.checked;
            this.game.switchColor(checked);
        });
        this.speedControlCheckbox = this.wrapper.querySelector('.speed-control');
        this.speedControlCheckbox.addEventListener('change', () => {
            this.game.isSpeedChanging = this.speedControlCheckbox.checked;
        });
        this.difficultyNumberInput =
            this.wrapper.querySelector('.difficulty-number');
        this.difficultyNumberInput.addEventListener('change', () => {
            const value = Number(this.difficultyNumberInput.value);
            this.game.difficulty = value;
        });
    }
    toggle() {
        this.wrapper.classList.toggle('show');
    }
}
