class Visitor {
    constructor(person, age) {
        this.person = person;
        this.age = age;
    }

    isValid() {
        return Object.values(this).every(Boolean);
    }

    static fromStrings(person, age) {
        try {
            const arr = {
                person: Visitor.splitter(person),
                age: Visitor.splitter(age),
            };
            const ext = {
                person: Visitor.extender(arr.person, arr.age.length).map(substitutesCallback),
                age: Visitor.extender(arr.age, arr.person.length),
            };
            return ext.person.map(
                (person, index) => new Visitor(person, ext.age[index])
            );
        } catch (error) {
            console.log(`Exception in Visitor.fromStrings:`, error)
            return null;
        }
    }

    static splitter(str, delim = `, `) {
        return str.split(delim).flatMap(str => {
            const matches = str.match(/(?<target>[åäö\w\s]+?)\sx(?<num>\d+)/);
            return matches ? Array(matches.groups.num).fill(matches.groups.target) : [str];
        });
    }

    static extender(array, length = 0) {
        const last = array.at(-1);
        const add = Math.max(length - array.length, 0);
        return array.concat(
            Array(add).fill(last)
        );
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
        this.visitors = Visitor.fromStrings(
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

    static fromRows([headers, ...rows]) {
        return rows.map((row, indexRow) => {
            const entries = headers.map((header, indexHeader) => [header, row[indexHeader]]);
            return new Errand(entries, indexRow + 2);
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
