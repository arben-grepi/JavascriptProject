//Funktio suodattaa taulukoita sarakkeen ja hakutermin perusteella. Se käy läpi kaikki taulukot ja
//niiden rivit, ja jos solu sisältää hakutermin, solu tummennetaan. Jos taulukosta ei löydy yhtään vastaavuutta, taulukko piilotetaan.
//Lopuksi, jos yhtäkään vastaavuutta ei löydy mistään taulukosta, käyttäjälle näytetään virheilmoitus.
function filterTablesByColumn(index, searchTerm) {
  // Etsitään kaikki taulukot näkymästä
  const tables = document.querySelectorAll("#groupTable table");
  if (index === -1) {
    alert(
      "Alasvetolaatikosta on valittava ensin sarake, josta haluat etsiä tiedon."
    );
    return;
  }
  if (searchTerm.length == 0) {
    poistaTummennusKolumnista(index, tables);
    return;
  }
  // laitetaan tämä todeksi jos löytyy hakuehtoa vastaava arvo. Jos ei löydy, niin julkaistaan virheilmoitus.
  let foundAnyMatch = false;
  tables.forEach((table) => {
    // Haetaan kaikki rivit taulukosta
    const rows = table.querySelectorAll("tr");

    //
    let foundMatch = false;
    // Seurataan, löytyykö hakutermi mistään solusta
    rows.forEach((row, rowIndex) => {
      // Aloitetaan indeksistä 1, koska ensimmäinen rivi on yleensä otsikkorivi
      if (rowIndex > 0) {
        const cell = row.querySelectorAll("td")[index];
        // Tarkistetaan, onko solu määritelty
        if (cell !== undefined) {
          // Tarkistetaan, onko solun sisältö sama kuin hakusana
          const cellString = cell.textContent.toLowerCase();

          if (cellString.includes(searchTerm.toLowerCase())) {
            foundAnyMatch = true;
            foundMatch = true;
            // Tummennetaan hakutermi solussa
            const originalText = cell.textContent;
            const newText = originalText.bold();
            cell.innerHTML = newText;
          } else {
            const originalText = cell.textContent;
            const newText = originalText.normalize();
            cell.innerHTML = newText;
          }
        }
      }
    });
    // Jos yhtäkään riviä ei löydy hakutermin perusteella, piilotetaan koko taulukko
    if (!foundMatch) {
      table.style.display = "none";
    } else {
      table.style.display = "";
    }
  });
  // Jos hakuehto ei ole löytynyt yhdestäkään taulukosta niin annetaan virheilmoitus
  if (!foundAnyMatch) {
    alert("Hakuehdollasi ei löytynyt tuloksia.");
  }
}

//Funktio poistaTummennusKolumnista poistaa tummennukset kaikista sarakkeista. Se käy läpi taulukot ja
//niiden rivit, normalisoiden jokaisen solun sisällön kyseisessä sarakkeessa. Lisäksi se varmistaa, että taulukot ovat näkyvissä.
function poistaTummennusKolumnista(index, tables) {
  tables.forEach((table) => {
    // Haetaan kaikki rivit taulukosta
    const rows = table.querySelectorAll("tr");

    // Seurataan, löytyykö hakutermi mistään solusta
    rows.forEach((row, rowIndex) => {
      // Aloitetaan indeksistä 1, koska ensimmäinen rivi on yleensä otsikkorivi
      if (rowIndex > 0) {
        const cell = row.querySelectorAll("td")[index];
        // Tarkistetaan, onko solu määritelty
        if (cell !== undefined) {
          //Normalisoidaan jokainen solu, eli poistetaan tummennus.
          const originalText = cell.textContent;
          const newText = originalText.normalize();
          cell.innerHTML = newText;
        }
      }
    });
    // taulu näkyviin
    table.style.display = "";
  });
}

//Funktio päivittää alasvetovalikon taulukon sarakkeiden perusteella. Se etsii kaikki taulukot näkymästä ja valitsee ensimmäisen
//taulukon toisen rivin, joka on taulukon otsikkorivi. Se hakee otsikkorivin solut (th tai td) ja tyhjentää alasvetovalikon
// attributeSelect. Lopuksi, se luo ja lisää uudet vaihtoehdot alasvetovalikkoon jokaisesta otsikosta.
//Jos taulukossa ei ole tarpeeksi rivejä, näytetään virheviesti.
export function checkDataInView() {
  // Etsitään kaikki taulukot näkymästä
  const tables = document.querySelectorAll("#groupTable table");

  if (tables.length > 0) {
    // Valitaan ensimmäinen taulukko
    const firstTable = tables[0];

    // Hakee kaikki rivit taulukosta
    const rows = firstTable.querySelectorAll("tr");

    // Jos taulukossa on vähintään kaksi riviä, valitaan toinen rivi
    if (rows.length > 1) {
      const headerRow = rows[1];

      // Hakee kaikki solut (th tai td) otsikkorivistä
      let headers = headerRow.querySelectorAll("th");
      if (headers.length === 0) {
        headers = headerRow.querySelectorAll("td");
      }

      // Hakee attributeSelect alasvetolaatikon
      const attributeSelect = document.getElementById("attributeSelect");

      // Tyhjennetään alasvetolaatikko ennen uusien vaihtoehtojen lisäämistä
      attributeSelect.innerHTML = "";

      // Luodaan uusi option-elementti jokaiselle otsikolle
      headers.forEach((header) => {
        const option = document.createElement("option");
        option.value = header.textContent.trim();
        option.textContent = header.textContent.trim();

        attributeSelect.appendChild(option);
      });
    } else {
      console.error("Taulukossa ei ole tarpeeksi rivejä.");
    }
  }
}

//Funktio käsittelee hakutoiminnon tapahtumat. Se hakee kaikki taulukot ja käyttäjän syöttämän hakusanan sekä valitun sarakkeen
//indeksin alasvetovalikosta attributeSelect. Jos käyttäjä painaa Enter-näppäintä ja hakusana on riittävän pitkä,
//funktio suodattaa taulukot kutsumalla filterTablesByColumn -funktiota. Jos käyttäjä painaa Backspace-näppäintä ja hakusana on
//lyhyempi kuin kaksi merkkiä, funktio poistaa tummennukset kutsumalla poistaTummennusKolumnista -funktiota ja suodattaa taulukot
//tyhjällä hakusanalla, joka johtaa siihen että kaikki taulukot palautetaan näkyviin ja normaalimuotoon ei-tummennettuna.
export function handleSearch(event) {
  const tables = document.querySelectorAll("#groupTable table");
  const hakusana = searchTermInput.value.trim();

  // Hakee attributeSelect alasvetolaatikon ja valitun indeksin
  const attributeSelect = document.getElementById("attributeSelect");
  const selectedColumnIndex = attributeSelect
    ? attributeSelect.selectedIndex
    : -1;

  // Tarkistetaan, onko painettu näppäin Enter ja hakusana on riittävän pitkä
  if (event.key === "Enter") {
    filterTablesByColumn(selectedColumnIndex, hakusana);
  } else if (event.key === "Backspace" && searchTermInput.value.length < 2) {
    // const tables = document.querySelectorAll("#groupTable table");
    poistaTummennusKolumnista(selectedColumnIndex, tables);
    filterTablesByColumn(selectedColumnIndex, "");
  }
}
