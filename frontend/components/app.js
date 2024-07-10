// importataan tarvittavat moduulit
import AppState from "./AppState.js";
import sortInGroups from "./sorter.js";
import printExcel from "./excel.js";
import displayDataInTable from "./tableWriter.js";
import { compareStudentlistings } from "./compareLists.js";
import { handleSearch, checkDataInView } from "./filtering.js";
import groupTableBuilder from "./groupTableBuilder.js";
import compareFiles from "./fileComparer.js";

//Luokka globaalin tilan hallintaan
const state = new AppState();

// Määritellään raahausalue
var uploadArea = document.getElementById("upload-area");

// Lisätään dragover-tapahtumankäsittelijä, joka estää oletustoiminnot (jotta raahaus toimii)
uploadArea.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = "copy"; // Näyttää käyttäjälle, että tiedosto(t) voi pudottaa
});

// Lisätään drop-tapahtumankäsittelijä, joka käsittelee pudotetut tiedostot
uploadArea.addEventListener("drop", function (e) {
  e.preventDefault();
  e.stopPropagation();
  var files = e.dataTransfer.files; // Saadaan raahatut tiedostot

  if (files.length) {
    var event = { target: { files: files } }; // Luodaan pseudo-event, joka jäljittelee inputin change-eventtiä
    processExcelFile(event); // Kutsutaan funktiota käsittelemään tiedosto(t)
  }
});
// Raahausalueen määrittely loppuu

// Tiedostolista
function addToFileView() {
  const peppiFile = state.getPeppiFile();
  const courseFile = state.getCourseFile();

  const fileView = document.getElementById("fileView");
  fileView.innerHTML = ""; // Tyhjennetään tiedostonäkymä

  if (peppiFile) {
    const peppiFileItem = document.createElement("div");
    peppiFileItem.className = "file-item mb-2";
    peppiFileItem.innerText = `${peppiFile.name}`;
    const removePeppiButton = document.createElement("button");
    removePeppiButton.innerText = "Poista";
    removePeppiButton.className = "btn btn-danger btn-sm ml-2";
    removePeppiButton.onclick = () => {
      state.clearPeppiFile(); // Kutsu tiedoston poistoon liittyvä funktio
      state.clearEnrolled();
      addToFileView(); // Päivitetään tiedostonäkymä poiston jälkeen
      if (!courseFile) clearTableData(); // Tyhjentää JSON-tiedoston tiedot taulukosta
    };
    peppiFileItem.appendChild(removePeppiButton);
    fileView.appendChild(peppiFileItem);
  }
  if (courseFile) {
    const courseFileItem = document.createElement("div");
    courseFileItem.innerText = `${courseFile.name}`;
    const removeCourseButton = document.createElement("button");
    removeCourseButton.innerText = "Poista";
    removeCourseButton.className = "btn btn-danger btn-sm ml-2";
    removeCourseButton.onclick = () => {
      state.clearCourseFile(); // Kutsu tiedoston poistoon liittyvä funktio
      state.clearRespondents();
      addToFileView(); // Päivitetään tiedostonäkymä poiston jälkeen
      if (!peppiFile) clearTableData(); // Tyhjentää JSON-tiedoston tiedot taulukosta
    };
    courseFileItem.appendChild(removeCourseButton);
    fileView.appendChild(courseFileItem);
  }
  const element = document.getElementById("fileContainer");

  if (!peppiFile && !courseFile) {
    element.style.visibility = "hidden";
    return;
  }

  element.style.visibility = "visible";
}

// ********************************* CLEAR TABLE
function clearTableData() {
  var table = document.getElementById("previewTable");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

//Populoidaan lajitteluvalitsimet header tiedoilla
function addToSortselectors(headers, fileType) {
  const segmentInput = document.getElementById("segSlt");
  const orderInput = document.getElementById("orderSlt");

  var optionLimiter = 0;

  if (fileType === "peppi") {
    optionLimiter = 2;
  } else {
    optionLimiter = 1;
  }

  segmentInput.innerHTML = `<option>Tyhjä</option>
    ${headers.map((header, index) => {
      if (index > optionLimiter) {
        return `<option id="${index}" value="${index}">${header}</option>`;
      }
    })}`;
  orderInput.innerHTML = `<option>Tyhjä</option>
  ${headers.map((header, index) => {
    if (index > optionLimiter) {
      return `<option id="${index}" value="${index}">${header}</option>`;
    }
  })}`;
}

//tapahtumakuuntelija lajitteluvalitsimille
function sortSelectionHandler(e) {
  e.preventDefault();
  //Elegentimpaa olisi luoda uusi child lista, jossa tunnistetulla nodella on disabled attribuutti
  //Menköön toistaseksi
  const optionArr = Array.from(e.target.children);
  const foundOptionElement = optionArr.find(
    (option) => option.selected === true
  );
  switch (e.target.id) {
    case "segSlt":
      const orderInput = document.getElementById("orderSlt");
      const orderArray = Array.from(orderInput.children);
      orderArray.forEach((option) => {
        if (option.disabled) {
          option.removeAttribute("disabled");
        }
      });
      const foundOrderElement = orderArray.find(
        (option) => option.id === foundOptionElement.id
      );
      if (foundOrderElement.value !== "Tyhjä") {
        foundOrderElement.setAttribute("disabled", "disabled");
      }
      break;
    case "orderSlt":
      const segmentInput = document.getElementById("segSlt");
      const segmentArray = Array.from(segmentInput.children);
      segmentArray.forEach((option) => {
        if (option.disabled) {
          option.removeAttribute("disabled");
        }
      });
      const foundSegmentElement = segmentArray.find(
        (option) => option.id === foundOptionElement.id
      );
      if (foundSegmentElement.value !== "Tyhjä") {
        foundSegmentElement.setAttribute("disabled", "disabled");
      }
      break;
  }
}
document
  .getElementById("segSlt")
  .addEventListener("change", sortSelectionHandler);
document
  .getElementById("orderSlt")
  .addEventListener("change", sortSelectionHandler);

// Excel tapahtumakäsittelijä
// Function to process Excel file
function processExcelFile(e) {
  // Hide the upload form after the file has been uploaded
  // document.getElementById("upload-container").style.display = "none";

  var file = e.target.files[0];

  // Tarkistaa onko syötetty tiedosto .xlsx tyyppinen. Käyttää MIME-tyyppiä
  if (
    file.type !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    alert("Syötä vain .xlsx excel tiedostoja");
    return;
  }

  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });

      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];

      // Convert data to JSON schema

      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      var headers = jsonData[0]; // Get the headers from the first row of the jsonData

      jsonData = jsonData
        .slice(1)
        .map(function (rowData) {
          var student = {};
          headers.forEach(function (header, index) {
            student[header] = rowData[index];
          });
          return student;
        })
        .filter(function (student) {
          // Siistii pois tyhjät rivit
          return Object.values(student).some((val) => val !== undefined);
        });

      var compareFilesResults = compareFiles(headers, jsonData);
      var filteredData = compareFilesResults.filteredData;
      var filteredHeaders = compareFilesResults.filteredHeaders;
      var fileType = compareFilesResults.filetype;

      var jsonWithHeaders = [];
      // compine filteredData and filteredHeaders to jsonWithHeaders
      for (let i = 0; i < filteredData.length; i++) {
        let obj = {};
        for (let j = 0; j < filteredHeaders.length; j++) {
          obj[filteredHeaders[j]] = filteredData[i][j];
        }
        jsonWithHeaders.push(obj);
      }

      // Jos tiedosto on peppi ja kurssitiedostoa ei ole ladattu, niin näytetään peppi tiedosto
      if (fileType === "peppi" && !state.getRespondents()) {
        clearTableData();
        state.setEnrolled(jsonWithHeaders);
        state.setPeppiFile(file);
        addToSortselectors(filteredHeaders, fileType); //sortselectors hakee statesta?

        displayDataInTable(filteredHeaders, filteredData, true);
        // Jos tiedosto on peppi ja kurssitiedosto on jo ladattu, niin näytetään kurssitiedosto
      } else if (fileType === "peppi" && state.getRespondents()) {
        state.setEnrolled(jsonWithHeaders);
        state.setPeppiFile(file);
      } else {
        // *********************** BELBI tai SCRUM-roolit tiedosto näkyviin käyttöliittymään*****************************************

        // tyhjennetään edelliset esikatselu taulukot jos on
        clearTableData();
        state.setRespondents(jsonWithHeaders);
        state.setCourseFile(file);
        addToSortselectors(filteredHeaders, fileType); //sortselectors hakee statesta?
        displayDataInTable(filteredHeaders, filteredData, false);
      }
      addToFileView();
    };
    reader.readAsArrayBuffer(file);
  }
}

// Event listener for Excel file input change
document
  .getElementById("excel-file")
  .addEventListener("change", processExcelFile);

document
  .getElementById("excel-file")
  .addEventListener("change", (e) => toggleVisibility(e));

document.addEventListener("dragstart", dragStart);
document.addEventListener("dragover", dragover);
document.addEventListener("drop", drop);

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragover(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  var data = e.dataTransfer.getData("text/plain"); // haetaan raahattava data
  var draggedElement = document.getElementById(data); // haetaan raahattavan elementti
  var dropTarget = e.target.parentNode.parentNode; // haetaan pudotettevan kohteen elementti

  var source = draggedElement.closest("table");
  var destination = dropTarget.closest("table");

  // boldattu solu muuttaa kohteen TR:ksi, siksi
  // muutetaan kohde takaisin Tableksi.
  if (dropTarget.nodeName === "TR") {
    dropTarget = dropTarget.parentNode;
  }

  if (dropTarget.classList.contains("table")) {
    // haetaan kohteen ryhmäId

    draggedElement.parentNode.removeChild(draggedElement); // poistetaan elementti DOMista
    dropTarget.appendChild(draggedElement); // lisätään raahattava elementti kohteeseen

    var dropTargetGroupId = dropTarget.id.substring(3) - 1;

    // jos siirretään lajitelluista lajittelemattomiin
    if (
      source.classList.contains("sortedGroup") &&
      destination.classList.contains("unsortedTable")
    ) {
      // haetaan alkuperäinen sijaintin 2D-listasta
      var [originalRow, originalIndex] = draggedElement.id
        .split("-")
        .slice(1)
        .map(Number);

      // poistetaan vanhasta listasta (lajitellut)
      var removableIndex = [originalRow, originalIndex];
      var movableStudent = state.groups[removableIndex[0]].splice(
        removableIndex[1],
        1
      )[0];

      // siirretään uuteen listaan (lajittelemattomat)
      state.ungrouped.push(movableStudent);
    }
    // jos siirretään lajitellusta ryhmästä toiseen ryhmään
    else if (
      source.classList.contains("sortedGroup") &&
      destination.classList.contains("sortedGroup")
    ) {
      // haetaan alkuperäinen sijaintin 2D-listasta
      var [originalRow, originalIndex] = draggedElement.id
        .split("-")
        .slice(1)
        .map(Number);

      // poistetaan vanhasta ryhmästä
      var removableIndex = [originalRow, originalIndex];
      var movableStudent = state.groups[removableIndex[0]].splice(
        removableIndex[1],
        1
      )[0];

      // siirretään uuteen ryhmään
      state.groups[dropTargetGroupId].push(movableStudent);
    }
    // jos siirretään lajittelemattomista lajiteltuihin
    else if (
      source.classList.contains("unsortedTable") &&
      destination.classList.contains("sortedGroup")
    ) {
      // haetaan alkuperäinen sijainti listasta
      var [originalRow] = draggedElement.id.split("-").slice(1);

      // poistetaan lajittelemattomista
      //var removableIndex = [originalRow];
      var movableStudent = state.ungrouped[originalRow];
      state.ungrouped.splice(originalRow, 1);

      // lisätään lajiteltuihin (haluttuun ryhmään)
      state.groups[dropTargetGroupId].push(movableStudent);
    }
    // muussa tapauksessa (esim. lajittelemattomista lajittelemattomiin)

    // if the original row is empty, remove it
    if (state.groups[originalRow].length === 0) {
      state.groups.splice(originalRow, 1);
    }

    // päivitetään taulut & indeksit
    groupTableBuilder(state.groups, state.ungrouped);
    var searchBox = document.getElementById("searchTermInput");

    // jos hakukentässä on hakusana, suorittaa haun uudelleen
    if (searchBox.value !== "") {
      handleSearch(new KeyboardEvent("keydown", { key: "Enter" }));
    }
  } else {
    return;
  }
}

function clearExistingTables() {
  // Etsii container-elementin, johon ryhmätaulukot lisätään
  const groupTableContainer = document.getElementById("groupTable");

  // Poistaa olemassa olevat ryhmätaulukot
  while (groupTableContainer.firstChild) {
    groupTableContainer.removeChild(groupTableContainer.firstChild);
  }
}

//Ryhmittelypainikkeen tapahtumakäsittelijä
function groupBySize(e) {
  e.preventDefault();
  const sizeInput = document.getElementById("sizeSelect");
  const size = sizeInput.value;
  const validInput = sizeInput.checkValidity();

  const segmentInput = document.getElementById("segSlt");
  const segmentSelection = parseInt(segmentInput.value);
  const orderInput = document.getElementById("orderSlt");
  const orderSelection = parseInt(orderInput.value);

  //Aiempi käsitteli viimeisimmän, nyt on kaksi listaa
  const enrolled = state.getEnrolled();
  const respondents = state.getRespondents();
  let groupTable = [];

  if (enrolled || respondents) {
    if (validInput) {
      if (size > 0) {
        // Poistaa vanhat taulukot ennen uusien luomista
        clearExistingTables();

        toggleVisibility(e);

        var ungrouped = state.clearUngrouped();

        //Vertailee listoja
        if (enrolled && respondents) {
          ungrouped = compareStudentlistings(enrolled, respondents);
          state.setUngrouped(ungrouped);
          groupTable = respondents;
        } else if (enrolled && !respondents) {
          groupTable = enrolled;
        } else {
          groupTable = respondents;
        }
        state.setGroups(
          sortInGroups(groupTable, size, segmentSelection, orderSelection)
        );

        //Muodostetaan table
        groupTableBuilder(state.getGroups(), state.getUngrouped());

        // Näytä lajittelemattomat kun ryhmät on lajiteltu (muutettavissa)
        let rightColumn = document.getElementById("rightColumn");
        rightColumn.style.display = "block"; // Näytä oikea sarake
      } else {
        alert("Syötä ryhmäkoko");
      }
    } else {
      alert("Anna ryhmäkoko kokonaislukuna");
    }
  } else {
    alert("Syötä tiedosto");
  }
}

document.getElementById("groupBtn").addEventListener("click", groupBySize);

// Piilottaa tai näyttää hakukentän sekä lajittelemattomat, riippuen siitä onko ryhmiä luotu.
function toggleVisibility(e) {
  var searchItems = document.getElementById("searchFilterItem");
  var searchItemsLabel = document.getElementById("searchFilterItemText");

  if (e.target.id === "groupBtn") {
    searchItems.style.display = "flex";
    searchItemsLabel.style.visibility = "visible";
  } else {
    searchItems.style.display = "none";
    searchItemsLabel.style.visibility = "hidden";
  }
  // filtering.js exportattu funktio, joka ottaa datan otsikot ja laittaa ne alasvetolaatikkoon
  //funktio myös lisää ensimmäisen kolumnin otsikon alasvetolaatikon valinnaksi.
  checkDataInView();
}

document.getElementById("printExcelBtn").addEventListener("click", function () {
  printExcel(state.getGroups(), state.getUngrouped());
});

// Lisätään tapahtumankuuntelija alasvetolaatikolle, joka aktivoituu aina kun alasvetolaatikkoa avataan
document
  .getElementById("attributeSelect")
  .addEventListener("focus", checkDataInView);
// Lisätään tapahtumankuuntelija tekstilaatikolle, joka aktivoituu aina kun painetaan nappia
const searchTermInput = document.getElementById("searchTermInput");

// Lisätään tapahtumankuuntelija tekstikentälle
searchTermInput.addEventListener("keydown", handleSearch);

document.getElementById("helpButton").addEventListener("click", toggleHelp);

function toggleHelp() {
  var helpWindow = document.getElementById("helpWindow");
  var helpbutton = document.getElementById("helpButton");
  helpWindow.classList.toggle("active");
  helpbutton.classList.toggle("active");
  if (helpbutton.classList.contains("active")) {
    helpbutton.innerHTML =
      '<img src= "assets/icons/cross.svg" class="close-icon">';
  } else {
    helpbutton.innerHTML = "?";
  }
}

document.getElementById("expandButton").addEventListener("click", function () {
  var hiddenButtons = document.getElementById("hiddenButtons");
  if (
    hiddenButtons.style.display === "none" ||
    hiddenButtons.style.display === ""
  ) {
    hiddenButtons.style.display = "block";
  } else {
    hiddenButtons.style.display = "none";
  }
});

//Luodaan tapahtumakäsittelijä logonapille
document.getElementById("logoBtn").addEventListener("click", reloadWindow);

function reloadWindow(e) {
  e.preventDefault();
  //Lataa sivuston uudelleen serveriltä ohittaa cachen = true
  window.location.reload(true);
}
