function onOpen(event) {
    const data = event.source.getSheetByName(`Ärende`).getDataRange().getValues();
    const dest = event.source.getSheetByName(`Statistik`);
    const first = new Vector(3, 2);
    const errands = ErrandsFromRows(data);
    const manager = StatManager(errands);
    const { grid, funcBorders } = manager.getContext();
    insertGrid(dest, first, grid);
    insertBorders(dest, first, funcBorders);
    setRowDebugger(dest);
}

function insertGrid(sheet, first, grid) {
    const bounds = new VectorBounds(
        first,
        Vector.gridSize(grid),
    );
    const range = bounds.toRange(sheet);
    sheet.clearFormats();
    sheet.getDataRange().clear();
    range.setValues(grid);
}

function insertBorders(sheet, first, funcBorders) {
    const setBorder = (range) => range.setBorder(true, true, true, true, null, null);
    const toRange = pipe(
        invokeFunc(first),
        VectorBounds.verify,
        (bounds) => bounds.toRange(sheet),
    );
    funcBorders.map(toRange).forEach(setBorder);
}

function setRowDebugger(sheet) {
    const storage = PersistentMutableStorage();
    const str = storage.strDebugger();
    sheet.getRange(1, 1).setValue(str);
    console.log(str);
}
