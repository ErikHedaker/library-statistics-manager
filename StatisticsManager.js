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
        this.filtered = this.errands.filter(Errand.filter);
        this.indent = new Indentation().next();
        const indentGroup = this.indent.next().next();
        const indentMember = indentGroup.next().next();
        const freqFn = frequencyCountSorted.bind(null, this.filtered);
        this.frequency = {
            primary: new DataGroup(`Frequency count for primary visitor helped`, {
                combined: new DataMember(
                    `Sorted by person & age`,
                    freqFn(errand => String(errand.primary)),
                    indentMember),
                person: new DataMember(
                    `Sorted by person`,
                    freqFn(errand => errand.primary.person),
                    indentMember),
                age: new DataMember(
                    `Sorted by age`,
                    freqFn(errand => errand.primary.age),
                    indentMember),
            }, indentGroup),
        };
    }

    toString() {
        const { current, previous } = this.indent.resolve;
        return multiline`
            ${this.constructor.name} {
            ${current}errands: [${arrayLengthToStr(this.errands)}],
            ${current}filtered: [${arrayLengthToStr(this.filtered)}],
            ${current}frequency: [${objectToStr(this.frequency, this.indent.next())}],
            ${previous}}`;
    }
}

class DataGroup {
    constructor(header, members, indent) {
        this.header = header;
        this.members = members;
        this.indent = indent;
    }

    toString() {
        const { current, previous } = this.indent.resolve;
        return multiline`
            ${this.constructor.name} {
            ${current}header: [${this.header}],
            ${current}members: [${objectToStr(this.members, this.indent.next())}],
            ${previous}}`;
    }
}

class DataMember {
    constructor(header, data, indent) {
        this.header = header;
        this.data = data;
        this.indent = indent;
    }

    toString() {
        const { current, previous } = this.indent.resolve;
        const indentProperty = this.indent.next().resolve.current;
        return multiline`
            ${this.constructor.name} {
            ${current}header: [${this.header}],
            ${current}data: [${entriesToStr(this.data, indentProperty)}
            ${current}],
            ${previous}}`;
    }
}

function frequencyCountSorted(array, transform) {
    return array.map(transform).reduce(
        (map, key) => map.set(key, (map.get(key) ?? 0) + 1), new Map()
    ).entries().toArray().toSorted((a, b) => b[1] - a[1]);
}

function sheetStatisticsReplace(sheet, str) {
    sheet.getRange(`B2`).setValue(str);
}