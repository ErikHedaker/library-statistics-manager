// ====================
//          Specialized
// ====================

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
//           Combinator
// ====================

function thrush(...args) {
    return (fn) => fn(...args);
}

function constant(arg) {
    return () => arg;
}

function prop(key) {
    return (obj) => obj[key];
}

function pipe(...callbacks) {
    return (arg) => callbacks.reduce((acc, callback) => callback(acc), arg);
}

function compose(...callbacks) {
    return (arg) => callbacks.reduceRight((acc, callback) => callback(acc), arg);
}

function reduce(reducer, initial) {
    return (arr) => initial === undefined ? arr.reduce(reducer) : arr.reduce(reducer, initial);
}

function map(mapper) {
    return (arr) => arr.map(mapper);
}

function partial(fn, ...preset) {
    return (...args) => fn(...preset, ...args);
}

function partialRight(fn, ...preset) {
    return (...args) => fn(...args, ...preset);
}

function curry(fn) {
    const satisfy = ({ length }) => length >= fn.length;
    const curried = (...args) => satisfy(args) ? fn(...args) : (...part) => curried(...args, ...part)
    return curried; 
}
