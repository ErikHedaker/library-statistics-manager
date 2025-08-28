class Frame {
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
        return new Frame(
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
        const size = Vector.calcSize(first, last);
        return new Frame(first, size);
    }

    static verify(value) {
        if (!(value instanceof Frame)) {
            throw `argument is not instance of class Frame`;
        }
        return value;
    }
}
