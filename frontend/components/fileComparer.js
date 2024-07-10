const hardCoded_peppi = [
  "Last name",
  "First name",
  "Name",
  "Email",
  "Email oma",
  "Student id",
  "Username",
  "Initial group",
  "State",
  "State code",
];

const hardCoded_Forms = [
  "ID",
  "Alkamisaika",
  "Valmistumisaika",
  "Sähköposti",
  "Nimi",
];

const hardCoded_Forms_eng = [
  "ID",
  "Start time",
  "Completion time",
  "Email",
  "Name",
];

function compareFiles(headers, jsonSchema) {
  // Check for hardCoded_Forms

  var filteredData = [];
  var filteredHeaders = [];
  var filetype = "";

  // Jos tiedoston otsikot vastaavat suomenkielisen forms-tiedoston otsikoita, suoritetaan tämä lohko.
  // Laajennettavissa lisäämällä englanninkieliset otsikot omaan taulukkoonsa ja lisäämällä ehto.
  if (
    headers.slice(0, 5).toString() === hardCoded_Forms.toString() ||
    headers.slice(0, 5).toString() === hardCoded_Forms_eng.toString()
  ) {
    jsonSchema.forEach(row => {
      var combined = [
        `${row["Nimi"]}`, // Yhdistetään kaksi ensimmäistä kenttää, sukunimi ja etunimi -> nimi
        row[Object.keys(row)[3]].substring(
          0,
          row[Object.keys(row)[3]].indexOf("@") // Opiskelijanumero
        ),
        row[Object.keys(row)[3]], // Sähköposti
        ...Object.values(row).slice(6),
      ];
      filteredData.push(combined);
    });
    filteredHeaders.push(
      "Nimi",
      "Opiskelijanumero",
      "Sähköposti",
      ...headers.slice(6)
    ); // Add headers to filteredHeaders
    filetype = "forms";
  }
  // Jos tiedoston otsikot vastaavat peppi-tiedoston otsikoita, suoritetaan tämä lohko.
  // Tämä lohko karsii tiedostosta kaikki muut otsikot kuin nimi, sähköposti, opiskelijanumero ja ryhmä.
  else if (headers.every((value, index) => value === hardCoded_peppi[index])) {
    jsonSchema.forEach(row => {
      var elementAt2 = [row["Name"]];
      var elementAt3 = [row["Email oma"]];
      var elementAt5 = [row["Student id"]];
      var elementAt7 = [row["Initial group"]];
      var combined = [
        ...elementAt2,
        ...elementAt5,
        ...elementAt3,
        ...elementAt7,
      ];
      filteredData.push(combined);
    });

    filteredHeaders.push("Nimi", "Opiskelijanumero", "Sähköposti", "Ryhmä"); // Add headers to filteredHeaders
    filetype = "peppi";
  }
  // Jos tiedoston otsikot eivät vastaa peppi-tiedoston tai forms-tiedoston otsikoita, suoritetaan tämä lohko.
  // Tässä lohkossa tiedostosta karsitaan vain etunimi ja sukunimi, muut otsikot säilytetään.
  else {
    jsonSchema.forEach(row => {
      var combined = [
        `${row["Etunimi"]} ${row["Sukunimi"]}`, // Concatenate first two fields
        ...Object.values(row).slice(2), // Include the rest of the fields
      ];
      filteredData.push(combined);
    });
    filteredHeaders.push("Nimi", ...headers.slice(2));
    filetype = "other";
  }

  //Palauttaa filtteröidyt otsikot ja datan, sekä tiedoston tyypin
  return { filteredHeaders, filteredData, filetype };
}

export default compareFiles;
