// ====================
//                 Math
// ====================
function toPercentage(value, total = 100.0) {
    return truncate((value / total) * 100.0, 2);
}
function truncate(value, decimals) {
    const accuracy = Math.pow(10, decimals);
    return Math.trunc(value * accuracy) / accuracy;
}


// ====================
//            Predicate
// ====================
function isObj(arg) {
    return Boolean(arg) && typeof arg === `object`;
}


// ====================
//           Comparator
// ====================
function sorterByKey(a, b) {
    return ternaryCmp(String(a[0]).toUpperCase(), String(b[0]).toUpperCase());
}
function sorterByKeyNumber(a, b) {
    return ternaryCmp(a[0], b[0]);
}
function ternaryCmp(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
}


// ====================
//                Array
// ====================
function entriesFrequencyCount(keys) {
    return keys.flat(Infinity).map(String).reduce(
        (map, key) => map.set(key, (map.get(key) ?? 0) + 1), new Map()
    ).entries().toArray().toSorted((a, b) => b[1] - a[1]);
}
function arrayDepth(arr) {
    //return !Array.isArray(value) ? 0 : 1 + value.map(arrayDepth).reduce(Math.max, 0);
    return !Array.isArray(arr) ? 0 : 1 + arr.reduce((max, item) => Math.max(max, arrayDepth(item)), 0);
}


// ====================
//               String
// ====================
function dataType(arg) {
    return isObj(arg) ? Object.prototype.toString.call(arg).slice(8, -1) : typeof arg;
}
function entriesToStr(entries, prefix = ``, suffix = ``, separator = `, `) {
    return entries.map(
        ([key, value]) => `${prefix}${key}: [${String(value)}]${suffix}`
    ).join(separator);
}
function multiline({ raw }, ...args) {
    return String.raw({ raw: raw.map(str => str.replace(/\n\s*/g, ``).replace(/\\n/g, `\n`)) }, ...args);
}