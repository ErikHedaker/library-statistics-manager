// ====================
//             Assorted
// ====================
function joinContextGrids(contexts, spacers = GridUtils.spacers()) {
    const joined = contexts.map(context => context.grid).reduce(
        (acc, grid) => acc.concat(spacers).concat(grid)
    );
    return GridUtils.normalize(joined);
}
function createContext(grid, relativeBorders = [], selfBorders = null) {
    const size = Vector.sizeGrid(grid);
    const selfBordersWithDefault = selfBorders ?? [
        (first) => new Frame(Vector.verify(first), new Vector(1, size.col)),
        (first) => new Frame(Vector.verify(first), size),
    ];
    return { grid, funcs: selfBordersWithDefault.concat(relativeBorders) };
}
function createRelativeBorders(contexts, offsetter, initial = new Vector(0, 0)) {
    return contexts.reduce(({ bound, offset }, { grid, funcs }) => {
        const offsetVerified = Vector.verify(offset)
        const offsetFuncBind = func => (first) => func(offsetVerified.add(Vector.verify(first)));
        const offsetFuncs = funcs.map(offsetFuncBind);
        const size = Vector.sizeGrid(grid);
        return {
            bound: bound.concat(offsetFuncs),
            offset: offsetter(size).add(offsetVerified),
        };
    }, { bound: [], offset: Vector.verify(initial) }).bound;
}

// ====================
//                Class
// ====================
class Indentation {
    constructor(steps = [`\n`]) {
        this.steps = steps;
    }

    get resolve() {
        return {
            current: this.steps.join(``),
            previous: this.steps.slice(0, -1).join(``),
        };
    }

    next(options) {
        return new Indentation(
            this.steps.concat(Indentation.step(options))
        );
    }

    toString() {
        return `${this.constructor.name} { steps.length: [${this.steps.length}] }`;
    }
    
    static step({ base = `|`, fill = ` `, size = 2 } = {}) {
        return base.padEnd(size, fill);
    }
}

// ====================
//          Mutable var
// ====================
const persistent = new (class {
    constructor() {
        this.service = PropertiesService.getScriptProperties();
        this.key = SpreadsheetApp.getActiveSpreadsheet().getName();
    }
    retrieve() {
        try {
            const str = this.service.getProperty(this.key);
            const value = JSON.parse(str);
            return isObj(value) ? value : {};
        } catch {
            return {};
        }
    }
    replace(value) {
        if (isObj(value)) {
            const str = JSON.stringify(value);
            this.service.setProperty(this.key, str);
        }
    }
    debuggingStr() {
        const date = new Date().toISOString();
        const storage = this.retrieve();
        const seq = storage.sequential;
        const num = Number.isInteger(seq) ? seq + 1 : 0;
        storage.sequential = num;
        this.replace(storage);
        return `[debuggingStr]: [${date}]: [${num}]`;
    }
})();


// ====================
//         Constant var
// ====================
const orderDate = {
    days: [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`],
    months: [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`],
};
const indentDefault = new Indentation().next();


// ====================
//               String
// ====================
function indexToStrDay(index) {
    return orderDate.days[index];
}
function indexToStrMonth(index) {
    return orderDate.months[index];
}
function arrLastToStr(arr, indent = indentDefault) {
    const { current, previous } = indent.resolve;
    return multiline`
        ${arr.constructor.name} {
        ${current}last: [${arr.at(-1)}],
        ${previous}}`;
}
function valueToStr(value, indent = indentDefault) {
    const isArr = (x) => Array.isArray(x) && x.length > 0;
    const fn = isObj(value) ? (isArr(value) ? arrLastToStr : objectToStr) : String;
    return fn(value, indent);
}
function objectToStr(obj, indent = indentDefault) {
    const { current, previous } = indent.resolve;
    const entries = Object.entries(obj);
    const str = entriesToStr(entries, current, `,`, ``);
    return `${obj.constructor.name} {${str}${previous}}`;
}
function rangeToStr(range) {
    return multiline`\n
        first.row: [${range.getRow()}]\n
        first.col: [${range.getColumn()}]\n
        last.row:  [${range.getLastRow()}]\n
        last.col:  [${range.getLastColumn()}]\n`;
}