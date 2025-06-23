class Errand {
    constructor(rowNum, data) {
        this.rowNum = rowNum;
        this.data = new Map(data);
        this.visitors = Visitor.from(
            this.data.get(`Hjälpte`),
            this.data.get(`Åldersgrupp`),
        );
    }

    get primary() {
        return this.visitors?.[0];
    }

    get companions() {
        return this.visitors?.length > 1 ? this.visitors.slice(1) : null; // : [];
    }

    get validate() {
        return true;
    }

    get validateOLD() {
        return this.date instanceof Date &&
            this.visitors instanceof Array && this.visitors.length > 0 &&
            Boolean(this.location) &&
            Boolean(this.difficulty) &&
            Boolean(this.category);
    }

    toString() {
        return multiline`
            ${this.constructor.name} {\n
            rowNum[${this.rowNum}]\n
            visitors[${this.visitors}]\n
            data[${this.data.entries().toArray()}]
            \n}`;
    }

    static from(sheet) {
        const [headers, ...records] = sheet.getDataRange().getValues();
        return records.map((record, index) => {
            const zipped = headers.map((header, index) => [header, record[index]]);
            return new Errand(index, zipped);
        });
    }

    static filter(errand) {
        const valid = errand.validate;
        if (!valid) {
            console.log(`Invalid datapoint: ${errand}`);
        }
        return valid && !excludeObject(errand.primary, [`person`, `age`], [`GLÖMT`, `-`]);
    }
}

class Visitor {
    constructor(person, age) {
        this.person = person;
        this.age = age;
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
        } catch (failure) {
            return (console.log(`${createVisitors.name} caught exception:`, failure), null);
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

function identifyErrand(errand) {
    return `${errand.constructor.name} { rowSheet: [${errand.rowSheet}], date: [${errand.date}] }`;
}

function dataType(arg) {
    return Boolean(arg) && typeof arg === `object` ? Object.prototype.toString.call(arg).slice(8, -1) : typeof arg;
}