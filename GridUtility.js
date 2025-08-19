class GridUtility {
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
        return Array(GridUtility.spacing()).fill([``]);
    }
    
    static getMaxWidth(grid) {
        //return grid.map(row => row.length).reduce(Math.max, 0);
        //return grid.reduce((accum, { length }) => Math.max(accum, length), 0);
        return grid.reduce((max, { length }) => max > length ? max : length, 0);
    }

    static getMinWidth(grid) {
        return grid.reduce((min, { length }) => min < length ? min : length, Infinity);
    }

    static info(grid) {
        const width = GridUtility.getMaxWidth(grid);
        const check = GridUtility.getMinWidth(grid);
        const uniform = width === check;
        const height = grid.length;
        return {
            width,
            height,
            uniform,
            str: `Grid: { width: [${width}], height: [${height}], uniform [${uniform}] }`,
        }
    }

    static normalize(grid) {
        return GridUtility.info(grid).uniform ? grid : GridUtility.padRight(grid, 0);
    }

    static concat(gridLeft, gridRight, indexLeft = 0) {
        const gridLeftPadding = Math.max(indexLeft + gridRight.length - gridLeft.length, 0);
        const gridLeftPadded = GridUtility.padDown(gridLeft, gridLeftPadding);
        const above = gridLeftPadded.slice(0, indexLeft);
        const below = gridLeftPadded.slice(indexLeft).map(
            (row, index) => row.concat(gridRight[index] ?? []) // nullish filler row
        );
        const joined = above.concat(below);
        return GridUtility.normalize(joined);
    }

    static subArray(width, sub = GridUtility.sub()) {
        return Array(Math.max(width, 0)).fill(sub);
    }

    static subGrid(height, width, sub = GridUtility.sub()) {
        return Array(Math.max(height, 0)).fill(GridUtility.subArray(width, sub));
    }

    static padRightExact(grid, width, sub = GridUtility.sub()) {
        return grid.map(row => row.concat(GridUtility.subArray(width - row.length, sub)));
    }

    static padLeftExact(grid, width, sub = GridUtility.sub()) {
        return grid.map(row => GridUtility.subArray(width - row.length, sub).concat(row));
    }

    static padDownExact(grid, height, sub = GridUtility.sub()) {
        return grid.concat(GridUtility.subGrid(height - grid.length, GridUtility.getMaxWidth(grid), sub));
    }

    static padUpExact(grid, height, sub = GridUtility.sub()) {
        return GridUtility.subGrid(height, GridUtility.getMaxWidth(grid), sub).concat(grid);
    }

    static padRight(grid, add = GridUtility.spacing(), sub = GridUtility.sub()) {
        return GridUtility.padRightExact(grid, add + GridUtility.getMaxWidth(grid), sub);
    }

    static padLeft(grid, add = GridUtility.spacing(), sub = GridUtility.sub()) {
        return GridUtility.padLeftExact(grid, add + GridUtility.getMaxWidth(grid), sub);
    }

    static padDown(grid, add = GridUtility.spacing(), sub = GridUtility.sub()) {
        return GridUtility.padDownExact(grid, add + grid.length, sub);
    }

    static padUp(grid, add = GridUtility.spacing(), sub = GridUtility.sub()) {
        return GridUtility.padUpExact(grid, add + grid.length, sub);
    }
}