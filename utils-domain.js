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
        filler = ``,
        spacing = 1,
    } = options;
    const spacers = Array(spacing).fill([filler]);
    const getWidthMinimum = (grid) => grid.map(prop(`length`)).reduce((acc, num) => Math.min(acc, num), Infinity);
    const getWidth = (grid) => grid.map(prop(`length`)).reduce((acc, num) => Math.max(acc, num), 0);
    const getHeight = (grid) => grid.length === 1 ? (grid[0].length === 0 ? 0 : 1) : grid.length;
    const info = (grid) => {
        const height = getHeight(grid);
        const width = getWidth(grid);
        const uniform = width === getWidthMinimum(grid);
        const str = `info { height: [${height}], width: [${width}], uniform [${uniform}] }`;
        return { width, height, uniform, str };
    };
    const subArray = (width) => Array(Math.max(width, 0)).fill(filler);
    const subGrid = (height, width) => Array(Math.max(height, 0)).fill(subArray(width));
    const padRightExact = (grid, len) => grid.map(row => row.concat(subArray(len - row.length)));
    const padLeftExact = (grid, len) => grid.map(row => subArray(len - row.length).concat(row));
    const padDownExact = (grid, len) => grid.concat(subGrid(len - getHeight(grid), getWidth(grid)));
    const padUpExact = (grid, len) => subGrid(len - getHeight(grid), getWidth(grid)).concat(grid);
    const padRight = (grid, add = spacing) => padRightExact(grid, add + getWidth(grid));
    const padLeft = (grid, add = spacing) => padLeftExact(grid, add + getWidth(grid));
    const padDown = (grid, add = spacing) => padDownExact(grid, add + getHeight(grid));
    const padUp = (grid, add = spacing) => padUpExact(grid, add + getHeight(grid));
    const padSides = (grid, add = spacing) => {
        const padder = pipe(
            partialRight(padRight, add),
            partialRight(padDown,  add),
            partialRight(padLeft,  add),
            partialRight(padUp,    add),
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
    const join = () => null;
    return {
        spacing,
        spacers,      // join
        info,
        padRight,     // join
        padSides,
        normalize,    // join
        concat,       // join
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