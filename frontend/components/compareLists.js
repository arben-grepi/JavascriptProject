import { binarySearch } from "./utilities.js";
//ottaa vastaan kaksi listaa. Vertailu opiskelijanumeron perusteella.
export function compareStudentlistings(courseData, questionnaireData) {
  //courseData opiskelijanro indeksissä 5
  //questionnaireData opiskelijanro indeksissä 2

  //Vertailu
  //Vastanneista luodaan vain opiskelijanumerot sisältävä taulukko
  const questionnaireIds = questionnaireData.map(item => {
    if (typeof Object.values(item)[1] === "number") {
      return Object.values(item)[1];
    }
  });
  //Sort vastanneiden opiskelijanumeroille binäärihakua varten
  const sortedQuestionnaire = questionnaireIds.sort((a, b) => a - b);

  let ungrouped = [];
  courseData.forEach(entry => {
    const values = Object.values(entry);
    const isFound = binarySearch(values[1], sortedQuestionnaire);
    if (isFound === false) {
      const newEntry = {
        name: values[0], // Lajittelemattomiin vain nimi ja opiskelijanumero
        studentID: values[1],
        //email: values[2],
      };
      ungrouped = ungrouped.concat(newEntry);
    }
  });

  //Palautetaan lista niistä, jotka eivät löydy vastanneiden listalta.
  return ungrouped;
}
