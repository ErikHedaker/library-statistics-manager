class Errand {
    constructor(indent, row, entries) {
        const dict = new Map(entries);
        this.indent = indent;
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

    toString() {
        const { current, previous } = this.indent.resolve;
        const propertiesStr = entriesToStr(Object.entries(this), current);
        return multiline`
            ${this.constructor.name} {
            ${propertiesStr}
            ${previous}}`;
    }

    static fromData([headers, ...datapoints]) {
        const indent = new Indentation().next();
        return datapoints.map((data, indexData) => {
            const entries = headers.map((header, indexHeader) => [header, data[indexHeader]]);
            return new Errand(indent, indexData + 2, entries);
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
        return [valid, invalid];
    }
}