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
    
    getContext() {
        const contexts = this.children.map(child => child.getContext());
        //const joined = contexts.map(context => context.grid).reduce((acc, grid) => GridUtils.concat(GridUtils.padRight(acc), grid));
        const reducer = (acc, grid) => pipe(
            GridUtility.padRight(acc)
        )
        const transform = pipe( // https://javascript.info/currying-partials
            map(context => context.grid),
            reduceDef((acc, grid) => GridUtility.concat(GridUtility.padRight(acc), grid)),
            GridUtility.padRight,
            GridUtility.padLeft,
            GridUtility.padDown,
            body => [[this.header], ...GridUtility.spacers()].concat(body),
            GridUtility.normalize,
        );
        const output = transform(contexts);
        const { width, height } = GridUtility.info(output);
        return {
            grid: output,
            funcs: [
                (row, col) => [row, col, 1, width],
                (row, col) => [row, col, height, width],
            ].concat(contexts.reduce(
                ({ bound, offset }, { grid, funcs }) => ({
                    bound: bound.concat(funcs.map(func => (row, col) => func(row + 1 + GridUtility.spacing(), col + offset))),
                    offset: offset + GridUtility.spacing() + GridUtility.info(grid).width,
                }), { bound: [], offset: GridUtility.spacing() }
            ).bound),
        };
    }
}