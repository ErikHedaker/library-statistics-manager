class StatClusterBase {
    constructor(indent, header, children) {
        this.indent = indent;
        this.header = header;
        this.children = children;
    }

    toString() {
        const { current, previous } = this.indent.resolve;
        const content = objectToStr(this.children, this.indent.next());
        return multiline`
            ${this.constructor.name} {
            ${current}header: [${this.header}],
            ${current}children: [${content}],
            ${previous}}`;
    }

    getContext() { // https://javascript.info/currying-partials
        const createGrid = pipe(
            map((context) => context.grid),
            reduce((acc, grid) => GridUtils.concat(GridUtils.padRight(acc), grid)),
            GridUtils.padSides,
            partialRight(GridUtils.addHeader, this.header),
        );
        const initial = new Vector(1 + GridUtils.spacing(), GridUtils.spacing());
        const offsetter = (size) => new Vector(0, size.col + GridUtils.spacing());
        const contexts = this.children.map(child => child.getContext());
        return createContext(
            createGrid(contexts),
            createRelativeBorders(contexts, offsetter, initial),
        );
    }
}