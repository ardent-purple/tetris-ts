export class Options {
    // HTML
    wrapper;
    restartButton;
    game;
    constructor(game) {
        this.game = game;
        this.wrapper = document.querySelector('.options-wrapper');
        this.restartButton = this.wrapper.querySelector('.restart');
        this.restartButton.addEventListener('click', () => {
            this.game.restart();
        });
    }
    toggle() {
        this.wrapper.classList.toggle('show');
    }
}
