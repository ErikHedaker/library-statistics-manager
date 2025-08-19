function onOpen(event) {
    const sheet = {
        input: event.source.getSheetByName(`Ärende`),
        output: event.source.getSheetByName(`Statistik`),
    };
    const manager = new StatisticsManager(Errand.from(sheet.input)); // .getDataRange().getValues()
    const { grid, funcs } = manager.getContext();
    const position = [2, 2];
    console.log(GridUtility.info(grid).str);
    insertGrid(sheet.output, grid, ...position);
    insertBorders(sheet.output, funcs, ...position);
}

function insertGrid(sheet, grid, row, col) {
    const height = grid.length;
    const width = grid[0].length;
    const range = sheet.getRange(row, col, height, width);
    sheet.clearFormats();
    sheet.getDataRange().clear();
    range.setValues(grid);
}

function insertBorders(sheet, funcs, row, col) {
    funcs.forEach(callback => insertBorder(sheet, ...callback(row, col)));
}

function insertBorder(sheet, row, col, height, width) {
    sheet.getRange(row, col, height, width).setBorder(true, true, true, true, null, null);
}