// ====================
//          Specialized
// ====================

function invokeFunc(...args) {
    return (fn) => fn(...args);
}

function invokeProp(key, ...args) {
    return (obj) => typeof obj[key] === `function` ? obj[key](...args) : obj[key];
}

function getProp(key) {
    return (obj) => obj[key];
}

function mapPropEntries(...callbacks) {
    return mapObject((fn) => ([k, v]) => fn([k, v]), ...callbacks);
}

function mapPropValues(...callbacks) {
    return mapObject((fn) => ([k, v]) => [k, fn(v)], ...callbacks);
}

function mapObject(fnEntry, ...callbacks) {
    const mapperEntry = pipe(fnEntry, map);
    return pipe(
        Object.entries,
        ...callbacks.map(mapperEntry),
        Object.fromEntries,
    );
}

function mergeSameKeyEntries(primaries, secondaries, merger) {
    return (x) => x;
}

function mergeSameKeyEntry(primary, secondary, merger) {
    return (x) => x;
}



// ====================
//               Impure
// ====================

function pipeLogger(message, mapper = (x) => x) {
    const out = (str) => console.log(`[${pipeLogger.name}]: [${message}]: [${str}]`);
    return (arr) => (out(arr.map(mapper).join(`, `)), arr);
}



// ====================
//               Common
// ====================

function pipe(...callbacks) {
    return (value) => callbacks.reduce((accum, callback) => callback(accum), value);
}

function compose(...callbacks) {
    return (value) => callbacks.reduceRight((accum, callback) => callback(accum), value);
}

function reduce(reducer, initial) {
    return (arr) => initial === undefined ? arr.reduce(reducer) : arr.reduce(reducer, initial);
}

function map(mapper) {
    return (arr) => arr.map(mapper);
}

function partial(fn, ...bound) {
    return (...args) => fn(...bound, ...args);
}

function partialRight(fn, ...bound) {
    return (...args) => fn(...args, ...bound);
}

function curry(fn) {
    const curried = (...args) => (
        args.length >= fn.length ? fn(...args) : (...next) => curried(...args, ...next)
    );
    return curried; 
}
