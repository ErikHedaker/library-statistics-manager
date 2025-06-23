function dataType(arg) {
    return Boolean(arg) && typeof arg === `object` ? Object.prototype.toString.call(arg).slice(8, -1) : typeof arg;
}

function multiline({ raw }, ...args) {
    return String.raw({ raw: raw.map(str => str.replace(/\n\s*/g, ``).replace(/\\n/g, `\n`)) }, ...args);
}

function arrayLengthToStr(arr) {
    return `${arr.constructor.name} { length: [${arr.length}] }`;
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