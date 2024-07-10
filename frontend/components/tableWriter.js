// ********************************* CLEAR TABLE GROUP
function clearTableData_group() {
  var table = document.getElementById("groupTable");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

// ********************************* CLEAR TABLE - preview
function clearTableData() {
  var table = document.getElementById("previewTable");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

/*********************** PEPPI sorttaus */
function sortTable_PEPPI(headerText, jsonData, headers) {
  //lajittelee datan klikatun header/otsikon mukaan
  const sortedData = jsonData.sort((a, b) => {
    const index = headers.indexOf(headerText);
    const aValue = a[index];
    const bValue = b[index];

    if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
      return parseFloat(aValue) - parseFloat(bValue);
    } else {
      return String(aValue).localeCompare(String(bValue));
    }
  });

  // tulostetaan uusi Peppi tiedoston esikatselu käyttäen lajiteltua tietoa.
  createPeppi(headers, sortedData);
}

/*************** toimii ESIMERKKI NAME headersilla.
  jsonData.sort((a, b) =>
    a[headers.indexOf("Name")].localeCompare(b[headers.indexOf("Name")])
  );*/

/*************** ********** BELBI sorttaus */
function sortTable(headerText, jsonData, headers) {
  //lajittelee datan klikatun header/otsikon mukaan
  const sortedData = jsonData.sort((a, b) => {
    const index = headers.indexOf(headerText);
    const aValue = a[index];
    const bValue = b[index];

    if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
      return parseFloat(aValue) - parseFloat(bValue);
    } else {
      return String(aValue).localeCompare(String(bValue));
    }
  });

  createMuuTaulukko(headers, sortedData);
}

/*************** ********** PEPPI TIEDOSTON - headers ja taulukko esikatselu */

// käytetään jsondatan sijasta -> data, koska meillä on käytössä sortedData ja jsonData
function createPeppi(headers, data) {
  // puhdistetaan vanha esikatselu näkymä
  clearTableData();

  // taulukon luonti
  var table = document.createElement("table");
  table.classList.add("table", "table-bordered", "table-striped");
  table.setAttribute("id", `previewContentTable`);

  var headerRow = document.createElement("tr");

  /************************************** HEADERS PEPPI näkymä alkaa */
  headers.forEach(headerText => {
    if (
      headerText === "Nimi" ||
      headerText === "Sähköposti" ||
      headerText === "Opiskelijanumero" ||
      headerText === "Ryhmä"
    ) {
      // Create a new header cell for the clicked header text
      var headerCell = document.createElement("th");
      headerCell.textContent = headerText;
      // eventListener - tapahtuma kuuntelija click
      headerCell.addEventListener("click", function () {
        sortTable_PEPPI(headerText, data, headers);
      });

      headerRow.appendChild(headerCell); // Append the new header cell to the row
    }
  });
  // Append Header Row to Table
  table.appendChild(headerRow);

  /************************************** esikatselu PEPPI näkymä alkaa */
  clearTableData_group(); // Olemassa olevien taulukoiden poistofunktio

  data.forEach((data, index) => {
    var row = document.createElement("tr");

    /* jsonData.sort((a, b) =>
            a[headers.indexOf("Name")].localeCompare(b[headers.indexOf("Name")])
          );*/
    // var row = table.insertRow(); - Tämä rivi yrittää lisätä uuden rivin taulukkoon.
    // Display Name
    var cell = document.createElement("td");
    // Solun sisältö asetetaan arvoon, joka löytyy ttaulukosta otsikkoa "Nimi" vastaavassa indeksissä.
    cell.textContent = data[headers.indexOf("Nimi")];
    // Lopuksi äskettäin luotu solu () liitetään lapsina (child) aiemmin luotuun riviin ().
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.textContent = data[headers.indexOf("Opiskelijanumero")];
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.textContent = data[headers.indexOf("Sähköposti")];
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.textContent = data[headers.indexOf("Ryhmä")];
    row.appendChild(cell);

    table.appendChild(row);
  });
  document.getElementById("previewTable").appendChild(table);
  // preview END
}

function createMuuTaulukko(headers, data) {
  clearTableData();

  /************************************** HEADER ROW BELBI Alkaa */
  var table = document.createElement("table");
  table.classList.add("table", "table-bordered", "table-striped");
  table.setAttribute("id", `previewContentTable`);

  var headerRow = document.createElement("tr");

  // Loop through Headers Array to Populate Header Cells
  headers.forEach(headerText => {
    // Create a new header cell for the clicked header text
    var headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerCell.addEventListener("click", function () {
      sortTable(headerText, data, headers);
    });
    headerRow.appendChild(headerCell); // Append the new header cell to the row
  });
  // Append Header Row to Table
  table.appendChild(headerRow);
  /************************************** HEADER ROW Loppuu */

  /************************************** BELBI näkymä */

  clearTableData_group(); // Olemassa olevien taulukoiden poistofunktio
  // tuodaan dataa taulukkoon
  //  forEach metodia jsonData2:n elementtien toistamiseen

  data.forEach((data, index) => {
    // Jokaiselle objektille lisätään uusi rivi taulukkoon insertRow()-käyttäeeen
    var row = table.insertRow();
    Object.values(data).forEach(value => {
      // kullekin arvolle luodaan uusi solu ja sen tekstisisältö asetetaan kyseiseen arvoon insertCell()
      var cell = row.insertCell();
      cell.textContent = value;

      table.appendChild(row);
    });
  });
  document.getElementById("previewTable").appendChild(table);
}

/************************************** ESIKATSELU  Alkaa */
function displayDataInTable(headers, jsonData, isPeppi) {
  if (isPeppi) {
    createPeppi(headers, jsonData);
  } else {
    createMuuTaulukko(headers, jsonData);
  }
}

export default displayDataInTable;
