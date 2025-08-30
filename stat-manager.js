function joinGrids(grids) {
    const { normalize, spacers } = utils.grid;
    const joined = grids.reduce(
        (acc, grid) => acc.concat(spacers).concat(grid)
    );
    return normalize(joined);
}

function createContext(grid, funcBordersRelative = [], funcBordersParent = null) {
    const { verify, gridSize } = utils.vector;
    const size = gridSize(grid);
    const funcBorders = (funcBordersParent ?? [
        (first) => VectorBounds(verify(first), Vector(1, size.col)),
        (first) => VectorBounds(verify(first), size),
    ]).concat(funcBordersRelative);
    return { grid, funcBorders };
}

function createRelativeBorders(contexts, offsetter, start = Vector(0, 0)) {
    const { verify, gridSize } = utils.vector;
    const initial = {
        offset: verify(start),
        funcBorders: [],
    };
    const reducer = (acc, context) => {
        const size = gridSize(context.grid);
        const vector = verify(acc.offset);
        const binder = (original) => pipe(
            verify,
            invokeProp(`add`, vector),
            original,
        );
        const funcBordersOffset = context.funcBorders.map(binder);
        return {
            offset: offsetter(size).add(vector),
            funcBorders: acc.funcBorders.concat(funcBordersOffset),
        };
    };
    return contexts.reduce(reducer, initial).funcBorders;
}

function StatManager(assorted) {
    const createChildren = (errands, lengths) => {
        const createStatClusterVisitors = (header, visitors, modifier = x => x) => {
            const fn = mapper => entriesFrequencyCount(visitors.map(mapper)).map(modifier);
            return StatCluster(header, [
                StatEntries(`Both person & age`, fn(visitor => `${visitor.person} & ${visitor.age}`)),
                StatEntries(`Only person`, fn(visitor => visitor.person)),
                StatEntries(`Only age`, fn(visitor => visitor.age)),
            ]);
        };
        const errandsDateStrAt = index => errands.at(index).date.toDateString();
        const mapperValuePercent = ([key, value]) => [key, toPercentage(value, errands.length)];
        const filterBelowMinimum = ([, value]) => value > (errands.length / 100.0);
        /*
        const mapFreq = fn => entriesFrequencyCount(errands.map(fn));
        const frq = pipe(
            map(key => [key, prop(key)]),
            map(([key, prop]) => [key, mapFreq(prop)]),
            Object.fromEntries,
        )(Errand.certain());
        const visitors = {
            primary: errands.map(x => x.primary),
            all: errands.flatMap(x => x.visitors),
        };
        */
        //const funcProps?? = ([key, prop]) => [key, mapFreq(prop)];
        //const dataProp = `date`;
        //const funcProp = `map`;
        /*
        funcPropInvoke replaces errands.map(x => x.location)
        obj = errands
        funcProp = map
        dataProp = location
        */

        /*
        const mapperNormalizeFuncProps = (value) => typeof value === `string` ? [value, `map`] : value;
        const funcPropInvoke = (key, arr) => (pipeDebug(`funcPropInvoke`)(key, arr), (funcProp) => arr[funcProp](getProp(key)));
        const funcPropsPipe = (key, funcProps) => (pipeDebug(`funcPropsPipe: (key, funcProps)`)(key, funcProps), (arr) => pipe(
            pipeDebug(`funcPropsPipe: argument`),
            ...funcProps.map(funcPropInvoke(key, arr)),
            pipeDebug(`funcPropsPipe: ...funcProps.map(funcPropInvoke(key, arr))`),
        )(arr));
        const mapperEntryValueToPipe = ([key, ...funcProps]) => (pipeDebug(`mapperEntryValueToPipe: (key, funcProps)`)(key, funcProps), [key, funcPropsPipe(key, funcProps)]);
        const mapperEntryValueInvoke = (arr) => ([key, fn]) => (pipeDebug(`mapperEntryValueInvoke: (arr, key, fn),`)(arr, key, fn), [key, fn(arr)]);
        const mapObj = (fn) => pipe(
            pipeDebug(`mapObj: argument`),
            Object.entries,
            pipeDebug(`mapObj: Object.entries`),
            map(fn),
            pipeDebug(`mapObj: map(fn)`),
            Object.fromEntries,
            pipeDebug(`mapObj: Object.fromEntries`),
        );


        const errandsToDictionaryPipe = (funcPropSetup) => (arr) => pipe(
            pipeDebug(`errandsToDictionaryPipe: argument`),
            map(mapperNormalizeFuncProps),
            pipeDebug(`errandsToDictionaryPipe: map(mapperNormalizeFuncProps`),
            map(mapperEntryValueToPipe),
            pipeDebug(`errandsToDictionaryPipe: map(mapperEntryValueToPipe)`),
            map(mapperEntryValueInvoke(arr)),
            pipeDebug(`errandsToDictionaryPipe: map(mapperEntryValueInvoke(arr))`),
            Object.fromEntries,
            pipeDebug(`errandsToDictionaryPipe: Object.fromEntries`),
        )(funcPropSetup);
        const core = errandsToDictionaryPipe([
          `row`,
          `date`,
          `location`,
          `difficulty`,
          `tags`,
          `primary`,
          //[`visitors`, `flatMap`],
          [`visitors`, `map`, `flat`],
        ])(errands);
        const freq = mapObj(entriesFrequencyCount)(core);


        console.log(`errandsToDictionaryPipe`);
        console.log(errandsToDictionaryPipe);
        console.log(`core`);
        console.log(core);
        console.log(`freq`);
        console.log(freq);
        */

        /*
        const errandsToFuncsPipe = (errands, setup) => pipe(
            map(x => typeof x === `string` ? [x, `map`] : x),
            map(([prop, ...accessors]) => [prop, propFuncs]),
            //map(([prop, ...accessors]) => [prop, data => pipe(accessors.map(access => data[access]()))]),
            map(([key, prop]) => [key, mapFreq(prop)]),
            Object.fromEntries,
        )(errands, errandSetup);
        */




        const invoke = {
            getHours: invokeProp(`getHours`),
            getDay: invokeProp(`getDay`),
            getMonth: invokeProp(`getMonth`),
        };
        const pipeDay = pipe(
            invoke.getDay,
            indexToStrDay,
        );
        const pipeMonth = pipe(
            invoke.getMonth,
            indexToStrMonth,
        );
        const entryKeyToStrDay = ([key, value]) => [indexToStrDay(key), value];
        const entryKeyToStrMonth = ([key, value]) => [indexToStrMonth(key), value];
        const standard = {
            row: errands.map(x => x.row),
            date: errands.map(x => x.date),
            location: errands.map(x => x.location),
            difficulty: errands.map(x => x.difficulty),
            tags: errands.map(x => x.tags),
            primary: errands.map(x => x.primary),
        };
        const atypical = {
            visitors: errands.flatMap(x => x.visitors),
            hour: standard.date.map(invoke.getHours),
            day: standard.date.map(invoke.getDay),
            month: standard.date.map(invoke.getMonth),
            //dayStr: standard.date.map(invoke.getDay),
            //monthStr: standard.date.map(invoke.getMonth),

        };
        const ordered = Object.fromEntries([
            ...Object.entries(standard),
            ...Object.entries(atypical),
        ]);
        //console.log(Object.keys(ordered));
        //console.log(Object.values(ordered).map(arr => arr.length));
        const frequency = {
            row: entriesFrequencyCount(ordered.row),
            date: entriesFrequencyCount(ordered.date),
            location: entriesFrequencyCount(ordered.location),
            difficulty: entriesFrequencyCount(ordered.difficulty),
            tags: entriesFrequencyCount(ordered.tags),
            primary: entriesFrequencyCount(ordered.primary),
            visitors: entriesFrequencyCount(ordered.visitors),
            hour: entriesFrequencyCount(ordered.hour),
            day: entriesFrequencyCount(ordered.day),
            month: entriesFrequencyCount(ordered.month),
        };

        return [
            StatCluster(`Scalar statistics`, [ // partial valid errands
                StatEntries(`Overview of errands`, [
                    [`Amount of total errands`, lengths.total],
                    [`Amount of validated errands`, lengths.valid],
                    [`Amount of invalidated errands`, lengths.invalid],
                    [`Date of first errand`, errandsDateStrAt(0)],
                    [`Date of most recent errand`, errandsDateStrAt(-1)],
                ]),
                StatEntries(`Overview of visitors`, [
                    [`Amount of primary visitors`, ordered.primary.length],
                    [`Amount of total visitors`, ordered.visitors.length],
                ]),
            ]),
            createStatClusterVisitors(`Frequency of primary visitors helped`, ordered.primary),
            createStatClusterVisitors(`Frequency of primary visitors helped, in percent`, ordered.primary, mapperValuePercent),
            createStatClusterVisitors(`Frequency of all visitors helped`, ordered.visitors),
            createStatClusterVisitors(`Frequency of all visitors helped, in percent`, ordered.visitors, mapperValuePercent),
            StatCluster(`Frequency of errand location`, [
                StatEntries(`Location`, frequency.location),
                StatEntries(`Location, in percent`, frequency.location.map(mapperValuePercent)),
            ]),
            StatCluster(`Frequency of errand difficulty`, [
                StatEntries(`Difficulty`, frequency.difficulty),
                StatEntries(`Difficulty, in percent`, frequency.difficulty.map(mapperValuePercent)),
            ]),
            StatCluster(`Frequency of errands by time`, [
                StatEntries(`Hourly`, frequency.hour),
                StatEntries(`Hourly, in percent`, frequency.hour.map(mapperValuePercent)),
                StatEntries(`Hourly, sorted by key`, frequency.hour.toSorted(sorterByKey)),
                StatEntries(`Hourly, sorted by key, in percent`, frequency.hour.toSorted(sorterByKey).map(mapperValuePercent)),
            ]),
            StatCluster(`Frequency of errands by day`, [
                StatEntries(`Day`, frequency.day),
                StatEntries(`Day, in percent`, frequency.day.map(mapperValuePercent)),
                StatEntries(`Day, sorted by key`, frequency.day.toSorted(sorterByKeyNumber)),
                StatEntries(`Day, sorted by key, in percent`, frequency.day.toSorted(sorterByKeyNumber).map(mapperValuePercent)),
                /*
                StatEntries(`Day, sorted by key`, frequency.day.toSorted(sorterByKeyNumber).map(([key, value]) => [indexToStrDay(key), value])),
                StatEntries(`Day, sorted by key, in percent`, frequency.day.toSorted(sorterByKeyNumber).map(mapperValuePercent).map(([key, value]) => [indexToStrDay(key), value])),
                */
            ]),
            StatCluster(`Frequency of errands by month`, [
                StatEntries(`Month`, frequency.month),
                StatEntries(`Month, in percent`, frequency.month.map(mapperValuePercent)),
                StatEntries(`Month, sorted by key`, frequency.month.toSorted(sorterByKeyNumber)),
                StatEntries(`Month, sorted by key, in percent`, frequency.month.toSorted(sorterByKeyNumber).map(mapperValuePercent)),
                /*
                StatEntries(`Month, sorted by key`, frequency.month.toSorted(sorterByKeyNumber).map(([key, value]) => [indexToStrMonth(key), value])),
                StatEntries(`Month, sorted by key, in percent`, frequency.month.toSorted(sorterByKeyNumber).map(mapperValuePercent).map(([key, value]) => [indexToStrMonth(key), value])),
                */
            ]),
            StatCluster(`Frequency of errand tags (such as systems encountered and methods used)`, [
                StatEntries(`All`, frequency.tags),
                StatEntries(`All, sorted by key`, frequency.tags.toSorted(sorterByKey)),
                StatEntries(`Filtered for >1%`, frequency.tags.filter(filterBelowMinimum)),
                StatEntries(`Filtered for >1%, in percent`, frequency.tags.filter(filterBelowMinimum).map(mapperValuePercent)),
            ]),
        ];
    };
    const sorted = assorted.toSorted((a, b) => a.date > b.date);
    const { valid, invalid } = ErrandsValidator(sorted);
    const lengths = {
        total: assorted.length,
        valid: valid.length,
        invalid: invalid.length,
    };
    const children = createChildren(valid, lengths);
    const getContext = () => {
        const { spacing } = utils.grid;
        const offsetter = (size) => Vector(size.row + spacing, 0);
        const contexts = children.map(invokeProp(`getContext`));
        const grids = contexts.map(prop(`grid`));
        return createContext(
            joinGrids(grids),
            createRelativeBorders(contexts, offsetter),
            [],
        );
    };
    return { getContext };
}

function StatCluster(header, children) {
    const getContext = () => { // https://javascript.info/currying-partials
        const { insertHeader, concat, pad, spacing } = utils.grid;
        const createGrid = pipe(
            map(prop(`grid`)),
            reduce((acc, grid) => concat(pad.right(acc), grid)),
            pad.sides,
            partial(insertHeader, header),
        );
        const start = Vector(1 + spacing, spacing);
        const offsetter = (size) => Vector(0, size.col + spacing);
        const contexts = children.map(invokeProp(`getContext`));
        return createContext(
            createGrid(contexts),
            createRelativeBorders(contexts, offsetter, start),
        );
    };
    return { getContext };
}

function StatEntries(header, grid) {
    const getContext = () => {
        const { insertHeader } = utils.grid;
        const titled = insertHeader(header, grid);
        return createContext(titled);
    };
    return { getContext };
}

/*
getNotes() {
    const notes = [
        `Main collection of errands used for the statistics is "valid errands", which is errands with all valid values.`,
        `The "invalid errands" collection is errands that are discarded due to any invalid values.`,
        `The "primary visitor" is the main visitor that I talked to and helped during the errand.`,
        `The "all visitors" collection is composed of the "primary visitor" as well as any visitor that accompanied with them.`,
        `The "tags" collection is non-scalar data in errands, where valid errands may have 1 or more tags, hence the why the sum of frequency counts for tags far outnumber the amount of total errands.`,
        `Visitors in the raw data contains various combinations of ["Kille", "Tjej", "Yngre barn", "Tonårig", "Bebis"], these are all merged into a single "Barn & Barn" in the statistics.`,
        `See the full list of grouped and deduced values in the sheet "<TBD>".`,
    ];
}
*/
