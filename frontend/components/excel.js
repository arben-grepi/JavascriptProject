function printExcel(groups, ungrouped) {
  var fileName = "ryhmat.xlsx";

  // Luodaan uusi Excel
  var wb = XLSX.utils.book_new();

  // Yhdistetään kaikkien ryhmien tiedot yhteen taulukkoon
  var combinedData = [];
  combinedData.push(["Ryhmä"].concat(Object.keys(groups[0][0])));

  // Käydään läpi ryhmät ja lisätään niiden tiedot yhdistettyyn taulukkoon
  groups.forEach((group, index) => {
    group.forEach((member) => {
      combinedData.push([index + 1].concat(Object.values(member)));
    });
    combinedData.push([]); // Tyhjä rivi ryhmän loppuun
  });

  // Lisätään ungrouped-ryhmän tiedot
  if (ungrouped && ungrouped.length > 0) {
    ungrouped.forEach((member) => {
      combinedData.push(["Ryhmätön"].concat(Object.values(member)));
    });
  }

  // Muunnetaan yhdistetty taulukko Exceliksi
  var ws = XLSX.utils.aoa_to_sheet(combinedData);

  // Lisätään taulukko Exceliin
  XLSX.utils.book_append_sheet(wb, ws, "Kaikki ryhmät");

  // Käydään läpi ryhmät ja lisätään jokaiselle ryhmälle oma sivu
  groups.forEach((group, index) => {
    var combinedData = [];
    combinedData.push(["Ryhmä"].concat(Object.keys(group[0])));
    group.forEach((member) => {
      combinedData.push([index + 1, ...Object.values(member)]);
    });

    // Luodaan uusi taulukko ryhmälle
    var ws = XLSX.utils.aoa_to_sheet(combinedData);

    // Asetetaan taulukon nimi ryhmän mukaan
    var sheetName = "Ryhmä " + (index + 1);

    // Lisätään taulukko Exceliin
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Tiedoston tallentaminen
  XLSX.writeFile(wb, fileName);
}

export default printExcel;
