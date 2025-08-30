function onOpen(event) {
    const data = event.source.getSheetByName(`Ärende`).getDataRange().getValues();
    const dest = event.source.getSheetByName(`Statistik`);
    const first = Vector(3, 2);
    const errands = ErrandsFromRows(data);
    const manager = StatManager(errands);
    const { grid, funcBorders } = manager.getContext();
    insertGrid(dest, first, grid);
    insertBorders(dest, first, funcBorders);
    setRowDebugger(dest);
}

function insertGrid(sheet, first, grid) {
    const { gridSize } = utils.vector;
    const { toRange } = utils.bounds;
    const bounds = VectorBounds(
        first,
        gridSize(grid),
    );
    const range = toRange(sheet, bounds);
    sheet.clearFormats();
    sheet.getDataRange().clear();
    range.setValues(grid);
}

function insertBorders(sheet, first, funcBorders) {
    const { verify, toRange } = utils.bounds;
    const setBorder = (range) => range.setBorder(true, true, true, true, null, null);
    const getRange = pipe(
        invokeFunc(first),
        verify,
        partial(toRange, sheet),
    );
    funcBorders.map(getRange).forEach(setBorder);
}

function setRowDebugger(sheet) {
    const storage = PersistentMutableStorage();
    const str = storage.strDebugger();
    sheet.getRange(1, 1).setValue(str);
    console.log(str);
}
