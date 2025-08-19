class StatEntriesBase {
    constructor(indent, header, children) {
        this.indent = indent;
        this.header = header;
        this.children = children;
    }

    toString() {
        const { current, previous } = this.indent.resolve;
        const content = entriesToStr(this.children, this.indent.next().resolve.current);
        return multiline`
            ${this.constructor.name} {
            ${current}header: [${this.header}],
            ${current}children: [${content}${current}],
            ${previous}}`;
    }

    getContext() {
        const tagged = [[this.header, ``]].concat(this.children);
        const output = GridUtility.normalize(tagged);
        const { width, height } = GridUtility.info(output);
        return {
            grid: output,
            funcs: [
                (row, col) => [row, col, 1, width],
                (row, col) => [row, col, height, width],
            ],
        };
    }
}