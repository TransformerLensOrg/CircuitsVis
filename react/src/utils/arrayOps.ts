/**
 * Slices a 2D array.
 *
 * @param arr - The 2D array to slice
 * @param dims - The dimensions to slice, as 2D array of pairs of start and end indices
 * @returns The sliced array
 */
export function arraySlice2D(
  arr: number[][],
  dims: [number, number][]
): number[][] {
  // Recursively apply the slicing operation on each dimension
  return arr
    .slice(dims[0][0], dims[0][1])
    .map((row) => row.slice(dims[1][0], dims[1][1]));
}

type NestedArrayOfNumbers = number[] | NestedArrayOfNumbers[];
/**
 * Finds the minimum and maximum values in a nested array of arbitrary depth.
 *
 * @param {any[]} arr - The input array.
 * @returns {[number, number]} A tuple containing the minimum and maximum values in the array.
 *
 * @example
 * minMaxInNestedArray([1, 2, 3, [4, 5, [6, 7]], 8]);
 * // returns [1, 8]
 *
 * @example
 * minMaxInNestedArray([[[[1]]]], 2, 3, [[4]]);
 * // returns [1, 4]
 */
export function minMaxInNestedArray(
  arr: NestedArrayOfNumbers
): [number, number] {
  if (arr.length === 0) {
    return [0, 1];
  }
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  for (let i = 0; i < arr.length; i += 1) {
    if (Array.isArray(arr[i])) {
      const [subMin, subMax] = minMaxInNestedArray(
        arr[i] as NestedArrayOfNumbers
      );
      min = Math.min(min, subMin);
      max = Math.max(max, subMax);
    } else {
      min = Math.min(min, arr[i] as number);
      max = Math.max(max, arr[i] as number);
    }
  }
  return [min, max];
}
