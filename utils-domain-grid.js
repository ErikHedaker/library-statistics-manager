class GridUtils {
    static debug(grid) {
        const formatStr = str => `"${str}"`;
        const formatRow = row => `(${row.length})<${row.map(formatStr).join(`;`)}>`;
        const formatted = grid.map(formatRow);
        console.log(formatted);
    }
    static sub() {
        return ``;
    }
    static spacing() {
        return 1;
    }
    static spacers() {
        return Array(GridUtils.spacing()).fill([``]);
    }
    static getMaxWidth(grid) {
        //return grid.map(row => row.length).reduce(Math.max, 0);
        //return grid.reduce((accum, { length }) => Math.max(accum, length), 0);
        return grid.reduce((max, { length }) => max > length ? max : length, 0);
    }
    static getMinWidth(grid) {
        return grid.reduce((min, { length }) => min < length ? min : length, Infinity);
    }
    static getHeight(grid) {
        const height = grid.length;
        return height === 1 ? (grid[0].length === 0 ? 0 : 1) : height;
    }
    static info(grid) {
        const height = GridUtils.getHeight(grid);
        const width = GridUtils.getMaxWidth(grid);
        const check = GridUtils.getMinWidth(grid);
        const uniform = width === check;
        return {
            width,
            height,
            uniform,
            str: `Grid: { width: [${width}], height: [${height}], uniform [${uniform}] }`,
        }
    }
    static normalize(grid) {
        return GridUtils.info(grid).uniform ? grid : GridUtils.padRight(grid, 0);
    }
    static concat(gridLeft, gridRight, indexLeft = 0) {
        const gridLeftPadding = Math.max(indexLeft + gridRight.length - gridLeft.length, 0);
        const gridLeftPadded = GridUtils.padDown(gridLeft, gridLeftPadding);
        const above = gridLeftPadded.slice(0, indexLeft);
        const below = gridLeftPadded.slice(indexLeft).map(
            (row, index) => row.concat(gridRight[index] ?? []) // nullish filler row
        );
        const joined = above.concat(below);
        return GridUtils.normalize(joined);
    }
    static subArray(width, sub = GridUtils.sub()) {
        return Array(Math.max(width, 0)).fill(sub);
    }
    static subGrid(height, width, sub = GridUtils.sub()) {
        return Array(Math.max(height, 0)).fill(GridUtils.subArray(width, sub));
    }
    static padRightExact(grid, width, sub = GridUtils.sub()) {
        return grid.map(row => row.concat(GridUtils.subArray(width - row.length, sub)));
    }
    static padLeftExact(grid, width, sub = GridUtils.sub()) {
        return grid.map(row => GridUtils.subArray(width - row.length, sub).concat(row));
    }
    static padDownExact(grid, height, sub = GridUtils.sub()) {
        return grid.concat(GridUtils.subGrid(height - grid.length, GridUtils.getMaxWidth(grid), sub));
    }
    static padUpExact(grid, height, sub = GridUtils.sub()) {
        return GridUtils.subGrid(height - grid.length, GridUtils.getMaxWidth(grid), sub).concat(grid);
    }
    static padRight(grid, add = GridUtils.spacing(), sub = GridUtils.sub()) {
        return GridUtils.padRightExact(grid, add + GridUtils.getMaxWidth(grid), sub);
    }
    static padLeft(grid, add = GridUtils.spacing(), sub = GridUtils.sub()) {
        return GridUtils.padLeftExact(grid, add + GridUtils.getMaxWidth(grid), sub);
    }
    static padDown(grid, add = GridUtils.spacing(), sub = GridUtils.sub()) {
        return GridUtils.padDownExact(grid, add + grid.length, sub);
    }
    static padUp(grid, add = GridUtils.spacing(), sub = GridUtils.sub()) {
        return GridUtils.padUpExact(grid, add + grid.length, sub);
    }
    static padSides(grid, add = GridUtils.spacing(), sub = GridUtils.sub()) {
        const padder = pipe(
            partialRight(GridUtils.padRight, add, sub),
            partialRight(GridUtils.padDown,  add, sub),
            partialRight(GridUtils.padLeft,  add, sub),
            partialRight(GridUtils.padUp,    add, sub),
        );
        return padder(grid);
    }
    static addHeader(grid, header) {
        const gridWithHeader = [[header]].concat(grid);
        return GridUtils.normalize(gridWithHeader);
    }
    static createdGridPadded(grid, header) {
        const gridWithPadding = GridUtils.padSides(grid);
        return GridUtils.addHeader(gridWithPadding, header);
    }
}