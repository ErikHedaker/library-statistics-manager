function onOpen(event) {
    const spreadsheet = event.source;
    const sheet = {
        input: spreadsheet.getSheetByName(`Ärende`),
        output: spreadsheet.getSheetByName(`Statistisk`),
    };
    const manager = new StatisticsManager(
        Errand.from(sheet.input)
    );
    console.log(`onOpen start`);
    console.log(String(manager.frequency.primary));
    console.log(`onOpen -----`);
    console.log(String(manager.frequency.primary.members.combined));
    console.log(`onOpen -----`);
    console.log(String(manager.frequency.primary.members.person));
    console.log(`onOpen -----`);
    console.log(String(manager.frequency.primary.members.age));
    console.log(`onOpen stop`);
}