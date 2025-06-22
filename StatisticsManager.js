/*
  [`Scalar data`, new Map([
      [`Total errands recorded before filtering`, stats.overview.totalRaw],
      [`Total errands recorded after filtering`, stats.overview.totalFilter],
      [`First errand`, identifyErrand(stats.overview.first)],
      [`Last errand`, identifyErrand(stats.overview.last)],
  ])],
*/

class StatisticsManager {
    constructor(errands) {
        this.errands = errands;
        this.filtered = filterErrands(this.errands);
        const freqFn = frequencyCountSorted.bind(null, this.filtered);
        this.frequency = {
            primary: new DataGroup(`Frequency count for primary visitor helped`, {
                combined: new DataMember(`Sorted by person & age`, freqFn(errand => String(errand.primary))),
                person: new DataMember(`Sorted by person`, freqFn(errand => errand.primary.person)),
                age: new DataMember(`Sorted by age`, freqFn(errand => errand.primary.age)),
            }),
        };
    }

    toString() {
        const base = `\n`;
        const next = `\n` + ``.padEnd(2);
        return multiline`
      ${this.constructor.name} {${next}
      errands: [${arrayLengthToStr(this.errands)}]${next}
      filtered: [${arrayLengthToStr(this.filtered)}]${next}
      frequency: [${objectToStr(this.frequency, ``, next, `,`)}]
      ${base}}`;
    }
}

class DataGroup {
    constructor(header, members) {
        this.header = header;
        this.members = members;
    }

    toString() {
        const base = `\n` + ``.padEnd(2);
        const next = `\n` + ``.padEnd(4);
        return multiline`
      ${this.constructor.name} {${next}
      header: [${this.header}],${next}
      members: [${objectToStr(this.members, ``, next, `,`)}],
      ${base}}`;
    }
}

class DataMember {
    constructor(header, data) {
        this.header = header;
        this.data = data;
    }

    overwrite(topleft = `B2`) {
        const data = [header, ``].concat(this.data);
        const origin = sheet.getRange(topleft);
        const target = sheet.getRange(origin.getRow(), origin.getCol(), data.length, 2);
        target.setValues(data);
        return target;
    }

    toString() {
        const base = `\n` + ``.padEnd(4);
        const next = `\n` + ``.padEnd(6);
        return multiline`
      ${this.constructor.name} {${next}
      header: [${this.header}],${next}
      data: [${entriesToStr(this.data, `,`, `${next}- `)}${next}],
      ${base}}`;
    }
}

function multiline({ raw }, ...args) {
    return String.raw({ raw: raw.map(str => str.replace(/\n\s*/g, ``).replace(/\\n/g, `\n`)) }, ...args);
}

function arrayLengthToStr(arr) {
    return `${arr.constructor.name} { length: [${arr.length}] }`;
}

function objectToStr(obj, separator = `\n`, prefix = ``, suffix = `,`) {
    const entries = Object.entries(obj);
    const str = entriesToStr(entries, separator, prefix, suffix);
    return `${obj.constructor.name} {\n${str}\n}`;
}

function entriesToStr(entries, separator = `, `, prefix = ``, suffix = ``) {
    return entries.map(
        ([key, value]) => `${prefix}${key}: [${String(value)}]${suffix}`
    ).join(separator);
}

function frequencyCountSorted(array, transform) {
    return array.map(transform).reduce(
        (map, key) => map.set(key, (map.get(key) ?? 0) + 1), new Map()
    ).entries().toArray().toSorted((a, b) => b[1] - a[1]);
}

function sheetStatisticsReplace(sheet, str) {
    sheet.getRange(`B2`).setValue(str);
}