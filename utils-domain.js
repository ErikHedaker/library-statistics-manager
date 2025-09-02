// ====================
//             Constant
// ====================

const UTILS = Object.freeze({
    grid: UtilsArray2D(),
    vector: UtilsVector2D(),
    frame: UtilsFrameVector2D(),
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
});



// ====================
//               String
// ====================

function indexToStrDay(index) {
    const { days } = UTILS.date;
    return days[index];
}

function indexToStrMonth(index) {
    const { months } = UTILS.date;
    return months[index];
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
        begin row: [${range.getRow()}]\n
        begin col: [${range.getColumn()}]\n
        end   row: [${range.getLastRow()}]\n
        end   col: [${range.getLastColumn()}]\n`;
}



// ====================
//               Impure
// ====================

function pipeLogger(message, mapper = (x) => x) {
    return (arr) => {
        const str = arr.map(mapper).join(`, `);
        console.log(`[${pipeLogger.name}]: [${message}]: [${str}]`);
        return arr;
    };
}



// ====================
//               Module
// ====================

function UtilsArray2D(options = {}) {
    const {
        spacing = 1,
        fillerStr = ``,
    } = options;
    const maxClamp = (a, b = 0) => Math.max(a, b);
    const arrClamp = (len) => Array(maxClamp(len));
    const getHeight = (grid) => grid.length;
    const getWidth  = (grid) => grid.map(({ length }) => length).reduce(maxClamp, 0);
    const isTabular = (grid) => ((width) => grid.every(({ length }) => length === width))(getWidth(grid));
    const fillerArray1D = (width) => arrClamp(width).fill(fillerStr);
    const fillerArray2D = (height, width) => arrClamp(height).fill(fillerArray1D(width));
    const pad = (() => {
        const absolute = {
            right: (grid, len) => grid.map((row) => row.concat(fillerArray1D(len - row.length))),
            left:  (grid, len) => grid.map((row) => fillerArray1D(len - row.length).concat(row)),
            down:  (grid, len) => grid.concat(fillerArray2D(len - getHeight(grid), getWidth(grid))),
            up:    (grid, len) => fillerArray2D(len - getHeight(grid), getWidth(grid)).concat(grid),
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
    const concatRight = (a, b, start = 0) => {
        const differ = b.length - a.length;
        const offset = Math.max(start + differ, 0);
        const padded = pad.down(a, offset);
        const joiner = (row, index) => row.concat(b[index])
        const prefix = padded.slice(0, start);
        const suffix = padded.slice(start).map(joiner);
        const joined = prefix.concat(suffix);
        return normalize(joined);
    }
    const joinGrids = (joiner) => (grids) => normalize(grids.reduce(joiner));
    const joinVerti = joinGrids((a, b) => pad.down(a).concat(b));
    const joinHoriz = joinGrids((a, b) => concatRight(pad.right(a), b));
    const addHeader = (header) => (grid) => normalize([[header]].concat(grid));
    return {
        spacing,
        getHeight,
        getWidth,
        pad,
        joinVerti,
        joinHoriz,
        addHeader,
    };
}

function PersistentMutableStorage() {
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
    const debugStr = () => {
        const date = new Date().toISOString();
        const obj = retrieve();
        const seq = obj.sequential;
        const num = Number.isInteger(seq) ? seq + 1 : 0;
        obj.sequential = num;
        replace(obj);
        return `[debugStr]-[${date}]-[${num}]`;
    };
    return {
        retrieve,
        replace,
        debugStr,
    };
}