class Errand {
    constructor(rowNum, data) {
        this.rowNum = rowNum;
        this.data = new Map(data);
        this.visitors = Visitor.from(
            this.data.get(`Hjälpte`),
            this.data.get(`Åldersgrupp`),
        ) ?? [];
    }

    get primary() {
        return this.visitors[0];
    }

    get companions() {
        return this.visitors.slice(1);
    }

    isValid() {
        return(
          Number.isInteger(this.rowNum) &&
          this.data instanceof Map &&
          this.data.size > 5 &&
          this.data.values().take(6).every(Boolean) &&
          this.visitors instanceof Array &&
          this.visitors.length > 0 &&
          this.visitors.every(visitor => visitor.isValid())
        );
    }

    toString() {
        return multiline`
            ${this.constructor.name} {
            ${` `}rowNum[${this.rowNum}],
            ${` `}visitors[${this.visitors}],
            ${` `}data[${this.data.entries().toArray()}] }`;
    }

    static from(sheet) {
        const [headers, ...records] = sheet.getDataRange().getValues();
        return records.map((record, rowNum) => {
            const zipped = headers.map((header, index) => [header, record[index]]);
            return new Errand(rowNum, zipped);
        });
    }

    static filter(errand) {
        const valid = errand.validate;
        if (!valid) {
            console.log(`Invalid datapoint: ${errand}`);
        }
        return valid && !excludeObject(errand.primary, [`person`, `age`], [`GLÖMT`, `-`]);
    }

    static validator(errands) {
        const valid = [];
        const invalid = [];
        const excludeList = [`GLÖMT`, `-`];
        const validValue = value => !excludeList.includes(value);
        const validVisitors = visitors => visitors.flatMap(Object.values).every(validValue);
        const validate = errand => errand.isValid && validVisitors(errand.visitors);
        errands.forEach(errand => (validate(errand) ? valid : invalid).push(errand));
        return [valid, invalid];
    }
}

class Visitor {
    constructor(person, age) {
        this.person = person;
        this.age = age;
    }

    isValid() {
        return Object.values(this).every(Boolean);
    }

    toString() {
        const str = entriesToStr(Object.entries(this));
        return `${this.constructor.name} { ${str} }`;
    }

    static from(strPerson, strAge) {
        try {
            //console.log(`strPerson[${strPerson}], strAge[${strAge}]`);
            const arrayPerson = customStrToArray(strPerson);
            const arrayAge = customStrToArray(strAge);
            const normalizePerson = normalizeArray(arrayPerson, arrayAge).map(substitutesCallback);
            const normalizeAge = normalizeArray(arrayAge, arrayPerson);
            return normalizePerson.map((person, index) => new Visitor(person, normalizeAge[index]));
        } catch (error) {
            return (console.log(`Visitor.from caught exception:`, error), null);
        }
    }
}

function customStrToArray(str) {
    if (!str?.length) throw { fn: customStrToArray.name, str };
    return str.split(`, `).flatMap(str => (match => // item
        !match ? [str] : Array(match.groups.num).fill(match.groups.target)
    )(str.match(/(?<target>[åäö\w\s]+?)\sx(?<num>\d+)/)));
}

function normalizeArray(arr, linked) {
    if (!arr?.length) throw { fn: normalizeArray.name, arr, linked };
    return arr.concat(Array(
        Math.max(linked.length - arr.length, 0)
    ).fill(arr.at(-1)));
}

function excludeObject(object, accessors, strings) {
    return strings.some(
        str => accessors.some(accessor => object[accessor] === str)
    );
}