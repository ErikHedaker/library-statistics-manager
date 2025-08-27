class StatEntriesBase {
    constructor(indent, header, grid) {
        this.indent = indent;
        this.header = header;
        this.grid = grid;
    }

    toString() {
        const { current, previous } = this.indent.resolve;
        const content = entriesToStr(this.grid, this.indent.next().resolve.current);
        return multiline`
            ${this.constructor.name} {
            ${current}header: [${this.header}],
            ${current}children: [${content}${current}],
            ${previous}}`;
    }
    
    getContext() {
        const gridWithHeader = GridUtils.addHeader(this.grid, this.header, []);
        return createContext(gridWithHeader);
    }
}