export class Options {
    // HTML
    wrapper;
    restartButton;
    colorControlCheckbox;
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
            console.log(checked);
            this.game.switchColor(checked);
        });
        console.log(this.colorControlCheckbox);
    }
    toggle() {
        this.wrapper.classList.toggle('show');
    }
}
