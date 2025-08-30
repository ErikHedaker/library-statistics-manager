// ====================
//          Specialized
// ====================

function invokeArg(...args) {
    return (fn) => fn(...args);
}

function invokeProp(key, ...args) {
    return (obj) => typeof obj[key] === `function` ? obj[key](...args) : obj[key];
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
//               Common
// ====================

function prop(key) {
    return (obj) => obj[key];
}

function pipe(...callbacks) {
    return (value) => callbacks.reduce((acc, callback) => callback(acc), value);
}

function compose(...callbacks) {
    return (value) => callbacks.reduceRight((acc, callback) => callback(acc), value);
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
    const satisfy = ({ length }) => length >= fn.length;
    const curried = (...args) => satisfy(args) ? fn(...args) : (...part) => curried(...args, ...part)
    return curried; 
}
