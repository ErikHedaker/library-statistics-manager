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

    clone() {
        return new Vector(this.row, this.col);
    }

    add(arg) {
        const adder = Vector.verify(arg);
        return new Vector(
            this.row + adder.row,
            this.col + adder.col,
        );
    }

    static verify(value) {
        if (!(value instanceof Vector)) {
            throw `value is not instance of class Vector`;
        }
        return value;
    }

    static calcSize(first, last) {
        return new Vector(
            (last.row - first.row) + 1,
            (last.col - first.col) + 1,
        );
    }

    static gridSize(grid) {
        const { height, width } = utils.grid.info(grid);
        return new Vector(height, width);
    }
}

class VectorBounds {
    constructor(first, size) {
        this._first = Vector.verify(first).clone();
        this._size = Vector.verify(size).clone();
    }

    get first() {
        return this._first;
    }

    get size() {
        return this._size;
    }

    clone() {
        return new VectorBounds(
            this.first.clone(),
            this.size.clone(),
        );
    }

    toRange(sheet) {
        return sheet.getRange(
            this.first.row,
            this.first.col,
            this.size.row,
            this.size.col,
        );
    }

    static fromRange(range) {
        const first = new Vector(
            range.getRow(),
            range.getColumn(),
        );
        const last = new Vector(
            range.getLastRow(),
            range.getLastColumn(),
        );
        return new VectorBounds(
            first,
            Vector.calcSize(first, last),
        );
    }

    static verify(value) {
        if (!(value instanceof VectorBounds)) {
            throw `argument is not instance of class VectorBounds`;
        }
        return value;
    }
}
