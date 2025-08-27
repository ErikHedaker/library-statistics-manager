function onOpen(event) {
    const data = event.source.getSheetByName(`Ärende`).getDataRange().getValues();
    const destination = event.source.getSheetByName(`Statistik`);
    const first = new Vector(3, 2);
    const errands = Errand.fromData(data);
    const manager = new StatisticsManager(errands);
    const { grid, funcs } = manager.getContext();
    const info = GridUtils.info(grid).str;
    console.log(info);
    insertGrid(destination, first, grid);
    insertBorders(destination, first, funcs);
    debuggingIdentifier(destination);
}

function insertGrid(sheet, first, grid) {
    const size = Vector.sizeGrid(grid);
    const frame = new Frame(first, size);
    const range = frame.toRange(sheet);
    sheet.clearFormats();
    sheet.getDataRange().clear();
    range.setValues(grid);
}

function insertBorders(sheet, first, funcs) {
    const setBorder = (range) => range.setBorder(true, true, true, true, null, null)
    const toRange = pipe(
        invokeFunc(first),
        Frame.verify,
        (frame) => frame.toRange(sheet),
    )
    funcs.map(toRange).forEach(setBorder);
}

function debuggingIdentifier(sheet) {
    const str = persistent.debuggingStr();
    sheet.getRange(1, 1).setValue(str);
    console.log(str);
}