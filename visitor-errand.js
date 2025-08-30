function ErrandsValidator(errands) {
    const valid = [];
    const invalid = [];
    const excludeList = [`GLÖMT`, `-`];
    const validValue = value => !excludeList.includes(value);
    const validVisitors = visitors => visitors.flatMap(Object.values).every(validValue);
    const validate = errand => errand.isValid && validVisitors(errand.visitors);
    errands.forEach(errand => (validate(errand) ? valid : invalid).push(errand));
    return { valid, invalid };
}

function ErrandsFromRows([headers, ...records], offset = 2) {
    return records.map((record, index) => {
        const zip = (header, field) => [header, record[field]];
        const entries = headers.map(zip);
        return Errand(entries, index + offset);
    });
}

function Errand(entries, row) {
    const record = new Map(entries);
    const data = {
        row,
        date: new Date(record.get(`Datum`)),
        location: record.get(`Plats`),
        difficulty: record.get(`Svårighet`),
        tags: record.get(`Taggar`).split(`, `),
        visitors: VisitorFromStrings(
            record.get(`Person`),
            record.get(`Åldersgrupp`),
        ) ?? [],
    };
    const primary = () => data.visitors[0];
    const companions = () => data.visitors.slice(1);
    const isValid = () => (
        Object.values(data).every(notNullish) &&
        Number.isInteger(data.row) &&
        data.row > 0 &&
        data.visitors instanceof Array &&
        data.visitors.length > 0 &&
        data.visitors.every(invokeProp(`isValid`))
    );
    return {
        ...data,
        primary,
        companions,
        isValid,
    };
}

function VisitorFromStrings(person, age) {
    const splitter = (str, delim = `, `) => {
        return str.split(delim).flatMap(str => {
            const matches = str.match(/(?<target>[åäö\w\s]+?)\sx(?<num>\d+)/);
            return matches ? Array(matches.groups.num).fill(matches.groups.target) : [str];
        });
    };
    const extender = (array, length = 0) => {
        const last = array.at(-1);
        const add = Math.max(length - array.length, 0);
        const filler = Array(add).fill(last);
        return array.concat(filler);
    };
    try {
        const arr = {
            person: splitter(person),
            age: splitter(age),
        };
        const ext = {
            person: extender(arr.person, arr.age.length).map(substitutesCallback),
            age: extender(arr.age, arr.person.length),
        };
        return ext.person.map((person, index) => Visitor(person, ext.age[index]));
    } catch (error) {
        console.log(`Exception caught in ${VisitorFromStrings.name}: [${error}]`);
    }
    return null;
}

function Visitor(person, age) {
    const isValid = () => Boolean(person) && Boolean(age);
    return { person, age, isValid };
}

/*
function excludeObject(object, accessors, strings) {
    return strings.some(
        str => accessors.some(accessor => object[accessor] === str)
    );
}
*/
