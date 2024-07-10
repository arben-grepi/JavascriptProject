import { handleSearch, checkDataInView } from "./filtering.js";

function groupTableBuilder(groups, ungrouped) {
  function clearTableData() {
    var table = document.getElementById("previewTable");
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
  }

  // Lisää placeholder rivin jos taulukko on tyhjä. Muuten poistaa sen. Tarvitaan,
  // jotta drag and drop toimii oikein.
  function checkPlaceHolder() {
    var unsortedTable = document.getElementById("unsortedTable");
    var placeholderRow = unsortedTable.querySelector(".placeholder-row");

    // If there are no rows in the unsorted table, add the placeholder row
    if (!unsortedTable.querySelector("tr:not(.placeholder-row)")) {
      if (!placeholderRow) {
        placeholderRow = document.createElement("tr");
        placeholderRow.classList.add("placeholder-row");
        var placeholderCell = document.createElement("td");
        placeholderCell.textContent = "Raahaa tähän";
        placeholderRow.appendChild(placeholderCell);
        unsortedTable.appendChild(placeholderRow);
      }
    } else if (placeholderRow) {
      // If there are rows and the placeholder exists, remove it
      placeholderRow.remove();
    }
  }
  clearTableData();
  // Tyhjennetään mahdolliset vanhat taulukot ennen uusien lisäämistä
  const groupTableContainer = document.getElementById("groupTable");
  groupTableContainer.innerHTML = "";

  var unsortedTable = document.getElementById("unsortedTable");
  unsortedTable.innerHTML = "";

  if (ungrouped) {
    ungrouped.forEach((entry, rowIndex) => {
      const entryValues = Object.values(entry);

      const row = document.createElement("tr");
      row.id = `row-${rowIndex}`;
      row.setAttribute("draggable", "true");
      row.setAttribute("dragstart", "dragStart(event)");
      row.setAttribute("dragover", "dragOver(event)");
      row.setAttribute("drop", "drop(event)");

      entryValues.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      unsortedTable.appendChild(row);
    });
  }
  // Kirjoittaa ryhmätaulukot
  if (groups) {
    // Haetaan ryhmän keyt käytettäväksi headereina
    const keyFieldNames = Object.keys(groups[0][0]);

    groups.forEach((group, index) => {
      // Luodaan div, joka sisältää taulukon
      var col = document.createElement("div");
      col.classList.add("col-md-12");
      col.setAttribute("id", `col${index + 1}`);

      // Create new table
      var table = document.createElement("table");
      table.classList.add("sortedGroup", "table", "table-bordered");
      table.setAttribute("id", `grp${index + 1}`);

      var extraRow = table.insertRow(0); // Insert at the top (index 0)
      extraRow.textContent = `Ryhmä: ${index + 1}`;
      extraRow.style.fontSize = "18px";

      // Create new table header
      var headerRow = document.createElement("tr");

      keyFieldNames.forEach(field => {
        // Create a new header cell
        var keyHeader = document.createElement("th");
        keyHeader.textContent = field;

        // Add the header to the header row
        headerRow.appendChild(keyHeader);
      });

      // Add the header row to the table
      table.appendChild(headerRow);

      // For each row in the schema
      group.forEach((member, rowIndex) => {
        // Create a new row
        var row = document.createElement("tr");
        row.setAttribute("id", `row-${index}-${rowIndex}`);

        Object.values(member).forEach(value => {
          var cell = document.createElement("td");
          cell.textContent = value;

          row.setAttribute("draggable", "true");
          row.setAttribute("dragstart", "dragStart(event)");
          row.setAttribute("dragover", "dragover(event)");
          row.setAttribute("drop", "drop(event)");

          row.appendChild(cell);
        });

        // Add the row to the table
        table.appendChild(row);
      });

      // Add the table to the document
      document.getElementById("groupTable").appendChild(col);
      document.getElementById(`col${index + 1}`).appendChild(table);
    });
  }

  checkPlaceHolder(); // lisää placeholder rivin jos taulukko on tyhjä. Muuten poistaa sen.
}

export default groupTableBuilder;
