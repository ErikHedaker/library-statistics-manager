class Visitor {
    constructor(person, age) {
        this.person = person;
        this.age = age;
    }

    isValid() {
        return Boolean(this.person) && Boolean(this.person);
    }

    toString() {
        const str = entriesToStr(Object.entries(this));
        return `${this.constructor.name} { ${str} }`;
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
            const duplicator = match => !match ? [str] : Array(match.groups.num).fill(match.groups.target);
            const result = str.match(/(?<target>[åäö\w\s]+?)\sx(?<num>\d+)/);
            return duplicator(result);
        });
    }

    static normalizeArray(arr, target) {
        const back = arr.at(-1);
        const add = Math.max(target.length - arr.length, 0);
        const append = Array(add).fill(back);
        return arr.concat(append);
    }
}

/*
function excludeObject(object, accessors, strings) {
    return strings.some(
        str => accessors.some(accessor => object[accessor] === str)
    );
}
*/