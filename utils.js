/*
const dateDays = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`];
const dateMonths = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
*/

const orderDate = {
    days: [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`],
    months: [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`],
};

function indexToStrDay(index) {
    return orderDate.days[index];
}

function indexToStrMonth(index) {
    return orderDate.months[index];
}

function valueToStr(value) {
    const indent = new Indentation().next();
    const { current, previous } = indent.resolve;
    return isObj(value) ? (Array.isArray(value) && value.length > 0 ? multiline`
        ${value.constructor.name} {
        ${current}back: [${value.at(-1)}],
        ${previous}}` : objectToStr(value, indent.next())) : String(value);
}

function entriesFrequencyCount(keys) {
    return keys.flat(Infinity).map(String).reduce(
        (map, key) => map.set(key, (map.get(key) ?? 0) + 1), new Map()
    ).entries().toArray().toSorted((a, b) => b[1] - a[1]);
}

function toPercentage(value, total = 100.0) {
    return truncate((value / total) * 100.0, 2);
}

function truncate(value, decimals) {
    const accuracy = Math.pow(10, decimals);
    return Math.trunc(value * accuracy) / accuracy;
}

function ternaryCmp(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
}

function sorterByKey(a, b) {
    return ternaryCmp(String(a[0]).toUpperCase(), String(b[0]).toUpperCase());
}

function sorterByKeyNumber(a, b) {
    return ternaryCmp(a[0], b[0]);
}

function multiline({ raw }, ...args) {
    return String.raw({ raw: raw.map(str => str.replace(/\n\s*/g, ``).replace(/\\n/g, `\n`)) }, ...args);
}

function objectToStr(obj, indent) {
    const { current, previous } = indent.resolve;
    const entries = Object.entries(obj);
    const str = entriesToStr(entries, current, `,`, ``);
    return `${obj.constructor.name} {${str}${previous}}`;
}

function entriesToStr(entries, prefix = ``, suffix = ``, separator = `, `) {
    return entries.map(
        ([key, value]) => `${prefix}${key}: [${String(value)}]${suffix}`
    ).join(separator);
}

function arrayDepth(value) {
    //return !Array.isArray(value) ? 0 : 1 + value.map(arrayDepth).reduce(Math.max, 0);
    return !Array.isArray(value) ? 0 : 1 + value.reduce((max, item) => Math.max(max, arrayDepth(item)), 0);
}

function arrayDebug(value) {
    console.log(`Nested depth of array: [${arrayDepth(value)}]`);
}

function dataType(arg) {
    return isObj(arg) ? Object.prototype.toString.call(arg).slice(8, -1) : typeof arg;
}

function isObj(arg) {
    return Boolean(arg) && typeof arg === `object`;
}

function curry(fn) {
    const curried = (...args) => (args.length >= fn.length ? fn(...args) : (...next) => curried(...args, ...next));
    return curried; 
}

function partial(fn, ...bound) {
    return (...args) => fn(...bound, ...args);
}

function partialRight(fn, ...bound) {
    return (...args) => fn(...args, ...bound);
}
function reduce(reducer, initial) {
    return array => array.reduce(reducer, initial);
}

function reduceDef(reducer) {
    return array => array.reduce(reducer);
}

function getProp(key) {
    return obj => obj[key];
}

/*
function pipeDebug(message, mapper = valueToStr) {
    return (...args) => {
        const out = args.map(mapper).join(`, `);
        console.log(`[${pipeDebug.name}]: [${message}]: [${out}]`);
        return args;
    }
}
*/

function debuggerFn(message, mapper = valueToStr) {
    const text = `[${debuggerFn.name}]: [${message}]: [${args.map(mapper).join(`, `)}]`;
    return (...args) => (console.log(text), args);
}

function compose(...callbacks) {
    return value => callbacks.reduceRight((accum, callback) => callback(accum), value);
}

function pipe(...callbacks) {
    return value => callbacks.reduce((accum, callback) => callback(accum), value);
}

function map(callback) {
    return array => array.map(callback);
}

function mapObject(entryFn, ...callbacks) {
    const entryMapper = pipe(entryFn, map);
    return pipe(
        Object.entries,
        ...callbacks.map(entryMapper),
        Object.fromEntries,
    );
}

function mapPropEntries(...callbacks) {
    return mapObject((fn) => ([k, v]) => fn([k, v]), ...callbacks);
}

function mapPropValues(...callbacks) {
    return mapObject((fn) => ([k, v]) => [k, fn(v)], ...callbacks);
}