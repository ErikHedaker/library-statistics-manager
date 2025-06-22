class Indentation {
    constructor(steps = [`\n`]) {
        this.steps = steps;
    }

    get resolve() {
        return {
            current: this.steps.join(``),
            previous: this.steps.slice(0, -1).join(``),
        };
    }

    next(options) {
        return new Indentation(
            this.steps.concat(Indentation.step(options))
        );
    }

    static step({ base = `|`, fill = ` `, size = 2 } = {}) {
        return base.padEnd(size, fill);
    }
}