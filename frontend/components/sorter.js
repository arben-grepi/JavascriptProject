// Jakaa opiskelijat ryhmiin, käyttäen opiskelijoiden valintoja ja ryhmän kokoa
function assignStudentsToGroups(studentList, groupSizeLimit) {
  const groups = [];

  // Tarkistaa onko minimikoko asetus päällä: true/false
  let checkMinSizeToggle = document.getElementById("minSizeToggle");
  let numGroups;

  // Jos minimikoko asetus on päällä, lasketaan ryhmien määrä jakojäännöksen avulla siten,
  // että ryhmän koko on aina vähintään määritelty minimikoko
  if (checkMinSizeToggle.checked) {
    numGroups = Math.floor(studentList.length / groupSizeLimit);
    if (numGroups < 1) {
      // ryhmän koko ei voi olla pienempi kuin 1.
      numGroups = 1;
    }
  } else {
    numGroups = Math.ceil(studentList.length / groupSizeLimit);
  }

  for (let i = 0; i < numGroups; i++) {
    groups.push([]);
  }

  // Jakaa oppilaita kunnes kaikki oppilaat on jaettu ryhmiin.
  studentList.forEach((student, index) => {
    const groupIndex = index % numGroups; // Laskee opiskelijan indeksin ryhmässä jakojäännöksen avulla
    try {
      groups[groupIndex].push(student);
    } catch (error) {
      //add an empty array to the group
      groups.push([]);
      groups[groupIndex].push(student);
    }
  });

  return groups;
}

// Fisher-Yates shuffle, joka sekoittaa opiskelijat ennen ryhmiin jakamista
function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

// Funktio joka jakaa opiskelijat segmentteihin, parametreina opiskelijalista ja segmentin indeksi
function segmentGroups(data, index) {
  //Otetaan attribuutti talteen
  const keys = Object.keys(data[0]);
  const attributeName = keys[index];

  const groupedData = {};
  data.forEach((item) => {
    const key = item[attributeName];
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(item);
  });

  const resultList = Object.keys(groupedData).map((key) => groupedData[key]);

  return resultList; // Palauttaa segmentoidun listan datasta
}

//Lajittelu järjestäminen
function orderGroups(data, index) {
  //Otetaan attribuutti talteen
  const keys = Object.keys(data[0]);
  const attributeName = keys[index];

  const groupedData = {};
  data.forEach((item) => {
    const key = item[attributeName];
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(item);
  });

  const resultList = Object.keys(groupedData)
    .map((key) => groupedData[key])
    .sort((a, b) => a.length - b.length) // Järjestetään datarivien määrän mukaan laskevasti
    .flat();

  return resultList; // Palauttaa järjestetyn listan datasta
}

export default sortInGroups;

// ehtorakenne, jolla kutsutaan eri funktioita parametrien perusteella
// voidaan joko segmentoida, järjestää, segmentoida + järjestää tai ei tehdä mitään näistä
// lajittelu  ryhmiin tehdään joka tapauksessa ennen listan palauttamista
function sortInGroups(
  studentsList,
  groupSize,
  segmentSelection, // samanlaisten indeksi
  orderSelection // erilaisten indeksi
) {
  var processedStudentList = []; // palautuva lista
  var isSegmented = false; // boolean jolla tarkistetaan onko lista 2D-lista lajittelua varten

  // lisätään satunnaisuutta listan järjestykseen
  studentsList = shuffle(studentsList);

  // suoritetaan järjestäminen ja segmentointi
  if (segmentSelection !== 0 && orderSelection !== 0) {
    // järjestäminen
    studentsList = orderGroups(studentsList, orderSelection);

    // segmentointi
    studentsList = segmentGroups(studentsList, segmentSelection); // palauttaa 2D array

    isSegmented = true;
  }

  // suoritetaan segmentointi
  else if (segmentSelection !== 0 && orderSelection === 0) {
    // segmentoidaan
    studentsList = segmentGroups(studentsList, segmentSelection); // palauttaa 2D array

    isSegmented = true;
  }

  // järjestely
  else if (segmentSelection === 0 && orderSelection !== 0) {
    studentsList = orderGroups(studentsList, orderSelection);
  }

  // lajittelu suoritetaan joka tapauksessa
  if (isSegmented) {
    // jos on valittu segmentointi (eli lista on 2D-lista)
    // käydään segmentoidun listan jokainen osa läpi ja lajitellaan ne
    studentsList.forEach((segment) => {
      const processedSegment = assignStudentsToGroups(segment, groupSize);

      processedSegment.forEach((processedElement) => {
        processedStudentList.push(processedElement);
      });
    });
  } else {
    // lajittelu 1D-listalle
    processedStudentList = assignStudentsToGroups(studentsList, groupSize);
  }

  // palautetaan prosessoitu lista
  return processedStudentList;
}
