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
    const spacers = Array(spacing).fill([substitute]);
    const getHeight = (grid) => grid.length;
    const getWidth  = (grid) => grid.map(prop(`length`)).reduce((acc, num) => Math.max(acc, num), 0);
    const isTabular = (grid) => (width => grid.every(row => row.length === width))(getWidth(grid));
    const substituteArray = (width) => Array(Math.max(width, 0)).fill(substitute);
    const substituteGrid = (height, width) => Array(Math.max(height, 0)).fill(substituteArray(width));
    const pad = (() => {
        const absolute = {
            right: (grid, len) => grid.map(row => row.concat(substituteArray(len - row.length))),
            left:  (grid, len) => grid.map(row => substituteArray(len - row.length).concat(row)),
            down:  (grid, len) => grid.concat(substituteGrid(len - getHeight(grid), getWidth(grid))),
            up:    (grid, len) => substituteGrid(len - getHeight(grid), getWidth(grid)).concat(grid),
        };
        const right = (grid, add = spacing) => absolute.right(grid, add + getWidth(grid));
        const left  = (grid, add = spacing) => absolute.left(grid,  add + getWidth(grid));
        const down  = (grid, add = spacing) => absolute.down(grid,  add + getHeight(grid));
        const up    = (grid, add = spacing) => absolute.up(grid,    add + getHeight(grid));
        const sides = (grid, add = spacing) => pipe(
            partialRight(right, add),
            partialRight(left,  add),
            partialRight(down,  add),
            partialRight(up,    add),
        )(grid);
        return { right, left, down, up, sides };
    })();
    const normalize = (grid) => isTabular(grid) ? grid : pad.right(grid, 0);
    const concat = (gridLeft, gridRight, indexLeft = 0) => {
        const gridLeftPadding = Math.max(indexLeft + gridRight.length - gridLeft.length, 0);
        const gridLeftPadded = pad.down(gridLeft, gridLeftPadding);
        const above = gridLeftPadded.slice(0, indexLeft);
        const below = gridLeftPadded.slice(indexLeft).map(
            (row, index) => row.concat(gridRight[index] ?? []) // nullish filler row
        );
        const joined = above.concat(below);
        return normalize(joined);
    }
    const insertHeader = (grid, header) => normalize([[header]].concat(grid));
    const join = () => null;
    return {
        getHeight,
        getWidth,
        spacing,
        spacers,             // join
        pad,
        normalize,           // join
        concat,              // join
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
    };
    const replace = (value) => {
        if (isObj(value)) {
            const str = JSON.stringify(value);
            service.setProperty(key, str);
            return true;
        }
        return false;
    };
    const strDebugger = () => {
        const date = new Date().toISOString();
        const obj = retrieve();
        const seq = obj.sequential;
        const num = Number.isInteger(seq) ? seq + 1 : 0;
        obj.sequential = num;
        replace(obj);
        return `[strDebugger]-[${date}]-[${num}]`;
    };
    return {
        retrieve,
        replace,
        strDebugger,
    };
}