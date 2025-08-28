class Visitor {
    constructor(person, age) {
        this.person = person;
        this.age = age;
    }

    isValid() {
        return Object.values(this).every(Boolean);
    }

    static from(personFull, ageFull) {
        try {
            const array = {
                person: Visitor.duplicatorArray(personFull),
                age: Visitor.duplicatorArray(ageFull),
            };
            const normalized = {
                person: Visitor.normalizeArray(array.person, array.age).map(substitutesCallback),
                age: Visitor.normalizeArray(array.age, array.person),
            };
            return normalized.person.map(
                (person, index) => new Visitor(person, normalized.age[index])
            );
        } catch (error) {
            console.log(`Exception in Visitor.from:`, error)
            return null;
        }
    }

    static duplicatorArray(strRaw, delim = `, `) {
        return strRaw.split(delim).flatMap(str => {
            const result = str.match(/(?<target>[åäö\w\s]+?)\sx(?<num>\d+)/);
            return !result ? [str] : Array(result.groups.num).fill(result.groups.target);
        });
    }

    static normalizeArray(arr, target) {
        const back = arr.at(-1);
        const add = Math.max(target.length - arr.length, 0);
        const append = Array(add).fill(back);
        return arr.concat(append);
    }
}

class Errand {
    constructor(entries, row) {
        const dict = new Map(entries);
        this.row = row;
        this.date = new Date(dict.get(`Datum`));
        this.location = dict.get(`Plats`);
        this.difficulty = dict.get(`Svårighet`);
        this.tags = dict.get(`Taggar`).split(`, `);
        this.visitors = Visitor.from(
            dict.get(`Person`),
            dict.get(`Åldersgrupp`),
        ) ?? [];
    }

    get primary() {
        return this.visitors[0];
    }

    get companions() {
        return this.visitors.slice(1);
    }

    isValid() {
        return (
            Object.values(this).every(value => value != null) &&
            Number.isInteger(this.row) &&
            this.row > 0 &&
            this.visitors instanceof Array &&
            this.visitors.length > 0 &&
            this.visitors.every(visitor => visitor.isValid())
        );
    }

    static fromData([headers, ...datapoints]) {
        return datapoints.map((data, indexData) => {
            const entries = headers.map((header, indexHeader) => [header, data[indexHeader]]);
            return new Errand(entries, indexData + 2);
        });
    }

    static validator(errands) {
        const valid = [];
        const invalid = [];
        const excludeList = [`GLÖMT`, `-`];
        const validValue = value => !excludeList.includes(value);
        const validVisitors = visitors => visitors.flatMap(Object.values).every(validValue);
        const validate = errand => errand.isValid && validVisitors(errand.visitors);
        errands.forEach(errand => (validate(errand) ? valid : invalid).push(errand));
        return { valid, invalid };
    }
}

/*
function excludeObject(object, accessors, strings) {
    return strings.some(
        str => accessors.some(accessor => object[accessor] === str)
    );
}
*/