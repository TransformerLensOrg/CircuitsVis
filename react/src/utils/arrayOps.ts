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
