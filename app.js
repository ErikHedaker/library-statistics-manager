function onOpen(event) {
    const spreadsheet = event.source;
    const sheet = {
        input: spreadsheet.getSheetByName(`Ärende`),
        output: spreadsheet.getSheetByName(`Statistisk`),
    };
    const manager = new StatisticsManager(Errand.from(sheet.input));
    console.log(String(manager.frequency.primary));
}