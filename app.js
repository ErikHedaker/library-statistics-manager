function onOpen(event) {
  const spreadsheet = event.source;
  const sheet = {
    input: spreadsheet.getSheetByName(`Ärende`),
    output: spreadsheet.getSheetByName(`Statistisk`),
  }
  const errands = createErrands(sheet.input);
  const filtered = filterErrands(errands);
  //const stats = getStatistics(filtered, errands.length);
  const manager = new StatisticsManager(errands);
  console.log(`onOpen start`);
  console.log(String(manager.frequency.primary));
  console.log(`onOpen -----`);
  console.log(String(manager.frequency.primary.members.combined));
  console.log(`onOpen -----`);
  console.log(String(manager.frequency.primary.members.person));
  console.log(`onOpen -----`);
  console.log(String(manager.frequency.primary.members.age));
  console.log(`onOpen stop`);
  //sheetStatisticsReplace(sheetOutput, out);
  //const data = new DataMember(`Sorted by person`, stats.primary.get(`person`));
}