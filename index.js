// ====================
//        Sheet trigger
// ====================

function onOpen(event) {
    const records = event.source.getSheetByName(`Ärende`).getDataRange().getValues();
    const mutater = event.source.getSheetByName(`Statistik`);
    try {
        operations(records).forEach(thrush(mutater));
    } catch (error) {
        const str = error.stack;
        console.log(str);
        mutater.getRange(1, 2).setValue(str);
    }
}



// ====================
//       Sheet mutation
// ====================

function operations(records) {
    const errands = ErrandsFromRecords(records);
    const { grid, funcBorders } = StatManager(errands).getContext();
    const debugging = Vector2D(1, 2);
    const beginning = Vector2D(3, 2);
    return [
        (sheet) => sheet.clearFormats(),
        (sheet) => sheet.getDataRange().clear(),
        ...prepMutBorders(beginning, funcBorders),
        prepMutStatistics(beginning, grid),
        prepMutDebugCell(debugging),
    ];
}

function prepMutStatistics(begin, grid) {
    const { sizeOfGrid } = UTILS.vector;
    const size = sizeOfGrid(grid);
    const frame = FrameVector2D(begin, size);
    return (sheet) => frame.toRange(sheet).setValues(grid);
}

function prepMutBorders(begin, funcBorders) {
    const { verify } = UTILS.frame;
    const args = [true, true, true, true, null, null];
    const realize = (frame) => (sheet) => frame.toRange(sheet).setBorder(...args);
    const prepare = pipe(
        thrush(begin),
        verify,
        realize,
    );
    return funcBorders.map(prepare);
}

function prepMutDebugCell({ row, col }) {
    const storage = PersistentMutableStorage();
    const str = storage.debugStr();
    return (sheet) => {
        sheet.getRange(row, col).setValue(str);
        console.log(str);
    };
}
