import { Clock } from './Clock.js';
import { Display } from './Display.js';
import { Keyboard } from './Keyboard.js';
import { getNextTetromino, getNextTetrominoRotation, } from './tetrominoes.js';
const GRID_WIDTH = 10; // cell count horizontal
const GRID_HEIGHT = 20; // cell count vertical
var Direction;
(function (Direction) {
    Direction["Left"] = "left";
    Direction["Right"] = "right";
})(Direction || (Direction = {}));
const initialTetrominoPosition = { x: 4, y: -1 };
export class Tetris {
    scoreContainer;
    display;
    keyboard;
    clock;
    field; // current playing field, one to render
    filledField; // field with filled cells
    currentTetromino = getNextTetromino();
    currentTetrominoPosition = initialTetrominoPosition;
    currentTetrominoRotation = getNextTetrominoRotation(this.currentTetromino);
    score = 0;
    isLastMove = false;
    constructor(container) {
        // score system
        this.scoreContainer = document.createElement('p');
        container.append(this.scoreContainer);
        this.renderScore();
        this.display = new Display(container, {
            cellWidth: GRID_WIDTH,
            cellHeight: GRID_HEIGHT,
            cellSize: 30,
        });
        this.keyboard = new Keyboard();
        this.clock = new Clock();
        this.field = [];
        this.filledField = [];
        this.clock.addRenderCallback(this.render.bind(this));
        // main game logic
        const mainGameLogicCallback = {
            callback: this.game.bind(this),
            interval: 250,
        };
        const strafeLeftCallback = {
            callback: this.strafeTetromino.bind(this, Direction.Left),
            interval: 150,
        };
        const strafeRightCallback = {
            callback: this.strafeTetromino.bind(this, Direction.Right),
            interval: 150,
        };
        this.clock.addLogicCallback(mainGameLogicCallback);
        // keyboard bindings
        this.keyboard.add({
            code: 'KeyA',
            keydownCallback: () => {
                this.strafeTetromino.bind(this, Direction.Left);
                this.clock.addLogicCallback(strafeLeftCallback);
            },
            keyupCallback: () => {
                this.clock.removeLogicCallback(strafeLeftCallback);
            },
        });
        this.keyboard.add({
            code: 'KeyD',
            keydownCallback: () => {
                this.strafeTetromino.bind(this, Direction.Right);
                this.clock.addLogicCallback(strafeRightCallback);
            },
            keyupCallback: () => {
                this.clock.removeLogicCallback(strafeRightCallback);
            },
        });
        this.keyboard.add({
            code: 'KeyW',
            keydownCallback: this.rotateTetromino.bind(this),
        });
        this.keyboard.add({
            code: 'KeyS',
            keydownCallback: this.pullFullTetromino.bind(this),
        });
        this.clock.start();
    }
    get currentTetrominoCoords() {
        return this.currentTetromino[this.currentTetrominoRotation];
    }
    get currentTetrominoAbsoluteCoords() {
        return this.currentTetrominoCoords.map((tetrominoeCoords) => ({
            x: tetrominoeCoords.x + this.currentTetrominoPosition.x,
            y: tetrominoeCoords.y + this.currentTetrominoPosition.y,
        }));
    }
    // game actions
    nextTetromino() {
        this.currentTetrominoPosition = initialTetrominoPosition;
        this.currentTetromino = getNextTetromino();
        this.currentTetrominoRotation = getNextTetrominoRotation(this.currentTetromino);
    }
    strafeTetromino(direction) {
        if (!this.checkCanStrafeTetromino(direction)) {
            return;
        }
        const nextX = this.currentTetrominoPosition.x + (direction === Direction.Left ? -1 : 1);
        this.currentTetrominoPosition = {
            ...this.currentTetrominoPosition,
            x: nextX,
        };
    }
    // pulls tetromino down
    pullTetromino() {
        this.currentTetrominoPosition = {
            ...this.currentTetrominoPosition,
            y: this.currentTetrominoPosition.y + 1,
        };
    }
    rotateTetromino() {
        if (!this.checkCanRotateTetromino()) {
            return;
        }
        this.currentTetrominoRotation = getNextTetrominoRotation(this.currentTetromino, this.currentTetrominoRotation);
    }
    saveTetromino() {
        this.filledField = [
            ...this.filledField,
            ...this.currentTetrominoAbsoluteCoords,
        ];
    }
    destroyFilledRows() {
        const allY = Array(GRID_HEIGHT)
            .fill(null)
            .map((_, index) => index);
        let destroyedRows = 0;
        for (const row of allY) {
            const filledCellsAmount = this.filledField.filter(({ y }) => y === row).length;
            if (filledCellsAmount !== GRID_WIDTH) {
                continue;
            }
            destroyedRows++;
            this.filledField = this.filledField
                .filter(({ y }) => y !== row)
                .map((coords) => coords.y > row ? coords : { ...coords, y: coords.y + 1 });
        }
        this.addScore(destroyedRows);
    }
    addScore(destroyedRows) {
        switch (destroyedRows) {
            case 1:
                this.score += 40;
                break;
            case 2:
                this.score += 100;
                break;
            case 3:
                this.score += 300;
                break;
            case 4:
                this.score += 1200;
        }
    }
    pullFullTetromino() {
        while (this.checkCanPullTetromino()) {
            this.pullTetromino();
        }
    }
    // game checks
    checkCanPullTetromino() {
        // find min y in tetromino
        const potentialPullAbsoluteCoords = this.currentTetrominoAbsoluteCoords.map((coords) => ({ ...coords, y: coords.y + 1 }));
        return !potentialPullAbsoluteCoords.some(({ x, y }) => y >= GRID_HEIGHT ||
            this.filledField.some(({ x: filledX, y: filledY }) => x === filledX && filledY === y));
    }
    checkCanStrafeTetromino(direction) {
        switch (direction) {
            case Direction.Left:
                const potentialStrafeLeftCoords = this.currentTetrominoAbsoluteCoords.map((coords) => ({
                    ...coords,
                    x: coords.x - 1,
                }));
                return !potentialStrafeLeftCoords.some(({ x, y }) => x < 0 ||
                    this.filledField.some(({ x: filledX, y: filledY }) => x === filledX && filledY === y));
            case Direction.Right:
                const potentialStrafeRightCoords = this.currentTetrominoAbsoluteCoords.map((coords) => ({
                    ...coords,
                    x: coords.x + 1,
                }));
                return !potentialStrafeRightCoords.some(({ x, y }) => x >= GRID_WIDTH ||
                    this.filledField.some(({ x: filledX, y: filledY }) => x === filledX && filledY === y));
        }
    }
    checkCanRotateTetromino() {
        const potentialTetrominoRotation = getNextTetrominoRotation(this.currentTetromino, this.currentTetrominoRotation);
        const potentialTetrominoCoords = this.currentTetromino[potentialTetrominoRotation].map((coords) => ({
            x: coords.x + this.currentTetrominoPosition.x,
            y: coords.y + this.currentTetrominoPosition.y,
        }));
        const x = potentialTetrominoCoords.map(({ x }) => x);
        const y = potentialTetrominoCoords.map(({ y }) => y);
        const maxY = Math.max(...y);
        const minX = Math.min(...x);
        const maxX = Math.max(...x);
        return maxY < GRID_HEIGHT && minX >= 0 && maxX < GRID_WIDTH;
    }
    game() {
        this.field = [...this.filledField, ...this.currentTetrominoAbsoluteCoords];
        // test
        // maybe separate pull logic?
        if (this.checkCanPullTetromino()) {
            this.pullTetromino();
            return;
        }
        if (!this.isLastMove) {
            this.isLastMove = true;
        }
        else {
            this.isLastMove = false;
            this.saveTetromino();
            this.destroyFilledRows();
            this.renderScore();
            this.nextTetromino();
        }
    }
    render() {
        this.display.render(this.field);
    }
    renderScore() {
        this.scoreContainer.textContent = this.score.toString();
    }
}
