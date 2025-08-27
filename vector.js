class Vector {
    constructor(row = 0, col = 0) {
        this._row = row;
        this._col = col;
    }

    get row() {
        return this._row;
    }

    get col() {
        return this._col;
    }

    toArray() {
        return [this.row, this.col];
    }

    clone() {
        return new Vector(
            this.row,
            this.col,
        );
    }

    add(arg) {
        const clone = Vector.verify(arg).clone();
        return new Vector(
            this.row + clone.row,
            this.col + clone.col,
        );
    }

    toString() {
        return `${this.constructor.name} { row: [${this.row}], col: [${this.col}] }`;
    }

    static verify(value) {
        if (!(value instanceof Vector)) {
            throw `value is not instance of class Vector`;
        }
        return value;
    }

    static calcFirst(size, last) {
        return new Vector(
            (last.row - size.row) + 1,
            (last.col - size.col) + 1,
        );
    }

    static calcLast(first, size) {
        return new Vector(
            (first.row + size.row) - 1,
            (first.col + size.col) - 1,
        );
    }

    static calcSize(first, last) {
        return new Vector(
            (last.row - first.row) + 1,
            (last.col - first.col) + 1,
        );
    }

    static sizeGrid(grid) {
        const { height, width } = GridUtils.info(grid);
        return new Vector(height, width);
    }
}