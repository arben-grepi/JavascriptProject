//Binäärihaku listojen vertailua varten
export function binarySearch(int, sortedArray) {
  const len = sortedArray.length;
  let start = 0;
  let end = len - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (sortedArray[mid] === int) {
      return true;
    } else if (sortedArray[mid] < int) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return false;
}
