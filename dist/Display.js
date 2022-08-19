const defaultOptions = {
    cellHeight: 20,
    cellWidth: 20,
    cellSize: 15,
    cellGap: 2,
    emptyColor: 'black',
};
const colors = {
    Yellow: 'yellow',
    Magenta: 'magenta',
    Cian: '#00fff7',
    Lightgreen: 'lightgreen',
    Orange: 'orange',
    White: 'white',
};
let prevRandomColor;
export const getNextRandomColor = () => {
    const colorKeys = Object.keys(colors);
    let index;
    do {
        index = Math.floor(Math.random() * colorKeys.length);
    } while (prevRandomColor === colorKeys[index]);
    return (prevRandomColor = colorKeys[index]);
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
        for (const { x, y, color } of points) {
            this.ctx2d.fillStyle = color ? colors[color] : colors.White;
            this.ctx2d.fillRect((1 + x) * this.options.cellGap + x * this.options.cellSize, (1 + y) * this.options.cellGap + y * this.options.cellSize, this.options.cellSize, this.options.cellSize);
        }
    }
    clear() {
        this.ctx2d.fillStyle = this.options.emptyColor;
        this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
