function VectorBounds(_first, _size) {
    const { verify } = utils.vector;
    const first = verify(_first).clone();
    const size = verify(_size).clone();
    const clone = () => VectorBounds(first, size);
    return { first, size, clone };
}

function Vector(row = 0, col = 0) {
    const { verify } = utils.vector;
    const clone = () => Vector(row, col);
    const add = (arg) => {
        const adder = verify(arg);
        return Vector(
            row + adder.row,
            col + adder.col,
        );
    };
    return { row, col, clone, add };
}

function UtilsVectorBounds() {
    const verify = (arg) => {
        const { verify } = utils.vector;
        const valid = (
            isObj(arg) &&
            verify(arg.first) &&
            verify(arg.size)
        );
        if (!valid) {
            throw `Argument is not valid VectorBounds object`;
        }
        return arg;
    };
    const fromRange = (range) => {
        const { vector } = utils;
        const first = Vector(
            range.getRow(),
            range.getColumn(),
        );
        const last = Vector(
            range.getLastRow(),
            range.getLastColumn(),
        );
        const size = vector.calcSize(first, last);
        return VectorBounds(first, size);
    };
    const toRange = (sheet, bounds) => {
        const { first, size } = bounds;
        return sheet.getRange(
            first.row,
            first.col,
            size.row,
            size.col,
        );
    };
    return { verify, fromRange, toRange };
}

function UtilsVector() {
    const verify = (arg) => {
        const valid = (
            isObj(arg) &&
            Number.isInteger(arg.row) &&
            Number.isInteger(arg.col)
        );
        if (!valid) {
            throw `Argument is not valid Vector object`;
        }
        return arg;
    };
    const calcSize = (_first, _last) => {
        const { vector } = utils;
        const first = vector.verify(_first);
        const last = vector.verify(_last);
        return Vector(
            (last.row - first.row) + 1,
            (last.col - first.col) + 1,
        );
    };
    const gridSize = (grid) => {
        const { getHeight, getWidth } = utils.grid;
        return Vector(
            getHeight(grid),
            getWidth(grid),
        );
    };
    return { verify, calcSize, gridSize };
}