// ====================
//      Sheet - Trigger
// ====================

function onOpen(event) {
    const mutate = thrush(event.source.getSheetByName(`Statistik`));
    const rows = event.source.getSheetByName(`Ärende`).getDataRange().getValues();
    const errands = ErrandsFromRows(rows);
    const manager = StatManager(errands);
    const { grid, funcBorders } = manager.getContext();
    const debug = Vector2D(1, 1);
    const begin = Vector2D(3, 2);
    [
        (sheet) => sheet.clearFormats(),
        (sheet) => sheet.getDataRange().clear(),
        prepareStatistics(begin, grid),
        ...prepareBorders(begin, funcBorders),
        prepareDebugCell(debug),
    ].forEach(mutate);
}



// ====================
//     Sheet - Mutation
// ====================

function prepareStatistics(begin, grid) {
    const { sizeOfGrid } = utils.vector;
    const size = sizeOfGrid(grid);
    const frame = FrameVector2D(begin, size);
    return (sheet) => frame.toRange(sheet).setValues(grid);
}

function prepareBorders(begin, funcBorders) {
    const { verify } = utils.frame;
    const args = [true, true, true, true, null, null];
    const realize = (frame) => (sheet) => frame.toRange(sheet).setBorder(...args);
    const prepare = pipe(
        thrush(begin),
        verify,
        realize,
    );
    return funcBorders.map(prepare);
}

function prepareDebugCell({ row, col }) {
    const storage = PersistentMutableStorage();
    const str = storage.strDebug();
    return (sheet) => {
        sheet.getRange(row, col).setValue(str);
        console.log(str);
    };
}
