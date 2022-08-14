const defaultOptions = {
    cellHeight: 20,
    cellWidth: 20,
    cellSize: 15,
    cellGap: 2,
    emptyColor: 'black',
    filledColor: 'white',
};
export class Display {
    canvas;
    ctx2d;
    options;
    constructor(container, options = {}) {
        this.options = {
            ...defaultOptions,
            ...options,
        };
        this.canvas = document.createElement('canvas');
        container.append(this.canvas);
        this.canvas.width =
            this.options.cellWidth * this.options.cellSize +
                (this.options.cellWidth + 1) * this.options.cellGap;
        this.canvas.height =
            this.options.cellHeight * this.options.cellSize +
                (this.options.cellHeight + 1) * this.options.cellGap;
        this.ctx2d = this.canvas.getContext('2d');
    }
    render(points) {
        // clear the screen
        this.clear();
        // fill the dots
        this.ctx2d.fillStyle = this.options.filledColor;
        for (const { x, y } of points) {
            this.ctx2d.fillRect((1 + x) * this.options.cellGap + x * this.options.cellSize, (1 + y) * this.options.cellGap + y * this.options.cellSize, this.options.cellSize, this.options.cellSize);
        }
    }
    clear() {
        this.ctx2d.fillStyle = this.options.emptyColor;
        this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
