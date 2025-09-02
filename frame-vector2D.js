function FrameVector2D(a, b) {
    const { verify } = utils.vector;
    const begin = verify(a).clone();
    const size = verify(b).clone();
    const clone = () => FrameVector2D(begin, size);
    const toRange = (sheet) => sheet.getRange(
        begin.row,
        begin.col,
        size.row,
        size.col,
    );
    return { begin, size, clone, toRange };
}

function Vector2D(row = 0, col = 0) {
    const { verify } = utils.vector;
    const clone = () => Vector2D(row, col);
    const add = (arg) => {
        const adder = verify(arg);
        return Vector2D(
            row + adder.row,
            col + adder.col,
        );
    };
    return { row, col, clone, add };
}

function UtilsFrameVector2D() {
    const verify = (arg) => {
        const { vector } = utils;
        const valid = (
            isObj(arg) &&
            vector.verify(arg.begin) &&
            vector.verify(arg.size)
        );
        if (!valid) {
            throw `Argument is not valid FrameVector2D object`;
        }
        return arg;
    };
    const fromRange = (range) => {
        const { sizeOfDiff } = utils.vector;
        const begin = Vector2D(
            range.getRow(),
            range.getColumn(),
        );
        const last = Vector2D(
            range.getLastRow(),
            range.getLastColumn(),
        );
        const size = sizeOfDiff(begin, last);
        return FrameVector2D(begin, size);
    };
    return { verify, fromRange };
}

function UtilsVector2D() {
    const verify = (arg) => {
        const valid = (
            isObj(arg) &&
            Number.isInteger(arg.row) &&
            Number.isInteger(arg.col)
        );
        if (!valid) {
            throw `Argument is not valid Vector2D object`;
        }
        return arg;
    };
    const sizeOfDiff = (a, b) => {
        const begin = verify(a);
        const last = verify(b);
        return Vector2D(
            (last.row - begin.row) + 1,
            (last.col - begin.col) + 1,
        );
    };
    const sizeOfGrid = (grid) => {
        const { getHeight, getWidth } = utils.grid;
        return Vector2D(
            getHeight(grid),
            getWidth(grid),
        );
    };
    return { verify, sizeOfDiff, sizeOfGrid };
}