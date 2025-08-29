// ====================
//             Constant
// ====================

const utils = {
    grid: ModuleGrid(),
    date: {
      days: [
          `Sunday`,
          `Monday`,
          `Tuesday`,
          `Wednesday`,
          `Thursday`,
          `Friday`,
          `Saturday`,
      ],
      months: [
          `January`,
          `February`,
          `March`,
          `April`,
          `May`,
          `June`,
          `July`,
          `August`,
          `September`,
          `October`,
          `November`,
          `December`,
      ],
    },
};



// ====================
//               String
// ====================

function indexToStrDay(index) {
    return utils.date.days[index];
}

function indexToStrMonth(index) {
    return utils.date.months[index];
}

function arrLastToStr(arr) {
    return `${arr.constructor.name} { last: [${arr.at(-1)}] }`;
}

function valueToStr(value) {
    const isArr = (x) => Array.isArray(x) && x.length > 0;
    const toStr = isObj(value) ? (isArr(value) ? arrLastToStr : objectToStr) : String;
    return toStr(value);
}

function objectToStr(obj) {
    const entries = Object.entries(obj);
    const str = entriesToStr(entries);
    return `${obj.constructor.name} { ${str} }`;
}

function rangeToStr(range) {
    return multiline`\n
        first.row: [${range.getRow()}]\n
        first.col: [${range.getColumn()}]\n
        last.row:  [${range.getLastRow()}]\n
        last.col:  [${range.getLastColumn()}]\n`;
}



// ====================
//               Module
// ====================

function ModuleGrid(options = {}) {
    const {
        substitute = ``,
        spacing = 1,
    } = options;
    const spacers = Array(spacing).fill([``]);
    //return grid.map(row => row.length).reduce(Math.max, 0);
    //return grid.reduce((accum, { length }) => Math.max(accum, length), 0);
    const getWidthMinimum = (grid) => grid.reduce((min, { length }) => min < length ? min : length, Infinity);
    const getWidth = (grid) => grid.reduce((max, { length }) => max > length ? max : length, 0);
    const getHeight = (grid) => grid.length === 1 ? (grid[0].length === 0 ? 0 : 1) : grid.length;
    const info = (grid) => {
        const height = getHeight(grid);
        const width = getWidth(grid);
        const uniform = width === getWidthMinimum(grid);
        const str = `info { height: [${height}], width: [${width}], uniform [${uniform}] }`;
        return { width, height, uniform, str };
    };
    const subArray = (width) => Array(Math.max(width, 0)).fill(substitute);
    const subGrid = (height, width) => Array(Math.max(height, 0)).fill(subArray(width, substitute));
    const padRightExact = (grid, len) => grid.map(row => row.concat(subArray(len - row.length, substitute)));
    const padLeftExact = (grid, len) => grid.map(row => subArray(len - row.length, substitute).concat(row));
    const padDownExact = (grid, len) => grid.concat(subGrid(len - getHeight(grid), getWidth(grid), substitute));
    const padUpExact = (grid, len) => subGrid(len - getHeight(grid), getWidth(grid), substitute).concat(grid);
    const padRight = (grid, add = spacing) => padRightExact(grid, add + getWidth(grid), substitute);
    const padLeft = (grid, add = spacing) => padLeftExact(grid, add + getWidth(grid), substitute);
    const padDown = (grid, add = spacing) => padDownExact(grid, add + getHeight(grid), substitute);
    const padUp = (grid, add = spacing) => padUpExact(grid, add + getHeight(grid), substitute);
    const padSides = (grid, add = spacing) => {
        const padder = pipe(
            partialRight(padRight, add, substitute),
            partialRight(padDown,  add, substitute),
            partialRight(padLeft,  add, substitute),
            partialRight(padUp,    add, substitute),
        );
        return padder(grid);
    }
    const normalize = (grid) => info(grid).uniform ? grid : padRight(grid, 0);
    const concat = (gridLeft, gridRight, indexLeft = 0) => {
        const gridLeftPadding = Math.max(indexLeft + gridRight.length - gridLeft.length, 0);
        const gridLeftPadded = padDown(gridLeft, gridLeftPadding);
        const above = gridLeftPadded.slice(0, indexLeft);
        const below = gridLeftPadded.slice(indexLeft).map(
            (row, index) => row.concat(gridRight[index] ?? []) // nullish filler row
        );
        const joined = above.concat(below);
        return normalize(joined);
    }
    const insertHeader = (grid, header) => {
        const gridWithHeader = [[header]].concat(grid);
        return normalize(gridWithHeader);
    }
    const insertStandard = (grid, header) => {
        const gridWithPadding = padSides(grid);
        return insertHeader(gridWithPadding, header);
    }
    const join = () => null;
    return {
        spacing,
        spacers,    // join
        info,
        padRight,   // join
        padSides,
        normalize,  // join
        concat,     // join
        insertHeader,
    };
}

function ModuleStorage() {
    const key = SpreadsheetApp.getActiveSpreadsheet().getName();
    const service = PropertiesService.getScriptProperties();
    const retrieve = () => {
        try {
            const str = service.getProperty(key);
            const value = JSON.parse(str);
            return isObj(value) ? value : {};
        } catch {
            return {};
        }
    }
    const replace = (value) => {
        if (isObj(value)) {
            const str = JSON.stringify(value);
            service.setProperty(key, str);
            return true;
        }
        return false;
    }
    const strDebugger = () => {
        const date = new Date().toISOString();
        const obj = retrieve();
        const seq = obj.sequential;
        const num = Number.isInteger(seq) ? seq + 1 : 0;
        obj.sequential = num;
        replace(obj);
        return `[strDebugger]-[${date}]-[${num}]`;
    }
    return {
        retrieve,
        replace,
        strDebugger,
    };
}