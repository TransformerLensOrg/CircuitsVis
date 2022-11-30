/**
 * Function for converting an array of numbers to a string representing the
 * range.
 * @param {Array<number>} rangeArr - Array of numbers representing a range.
 * @returns {string} - String representing the range.
 */
export function rangeArrToString(rangeArr: number[]): string {
  return rangeArr.length < 3
    ? rangeArr.join("-")
    : `${rangeArr[0]}-${rangeArr[rangeArr.length - 1]}`;
}

/**
 * Function for converting a string representing of a range to an array of
 * numbers.
 * @param {string} rangeStr - String representing a range.
 * @returns {Array<number>} - Array of numbers representing the range.
 */
export function rangeStringToArr(rangeStr: string): number[] {
  const rangeArr = rangeStr.split("-");
  if (rangeArr.length === 1) {
    return [parseInt(rangeArr[0], 10)];
  }
  const start = parseInt(rangeArr[0], 10);
  const end = parseInt(rangeArr[rangeArr.length - 1], 10);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
