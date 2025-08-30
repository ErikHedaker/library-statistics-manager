function VectorBounds(a, b) {
    const { verify } = utils.vector;
    const first = verify(a).clone();
    const size = verify(b).clone();
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
        const { sizeOfDiff } = utils.vector;
        const first = Vector(
            range.getRow(),
            range.getColumn(),
        );
        const last = Vector(
            range.getLastRow(),
            range.getLastColumn(),
        );
        const size = sizeOfDiff(first, last);
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
    const sizeOfDiff = (a, b) => {
        const first = verify(a);
        const last = verify(b);
        return Vector(
            (last.row - first.row) + 1,
            (last.col - first.col) + 1,
        );
    };
    const sizeOfGrid = (grid) => {
        const { getHeight, getWidth } = utils.grid;
        return Vector(
            getHeight(grid),
            getWidth(grid),
        );
    };
    return { verify, sizeOfDiff, sizeOfGrid };
}