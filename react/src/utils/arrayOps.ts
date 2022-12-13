// // Creates a type that represents a multidimensional array with any number of dimensions
// type MultiArray<T> = T[] | MultiArray<T>[];
// /**
//  * Slices a multidimensional array.
//  *
//  * @param arr - The array to slice
//  * @param dims - The dimensions to slice, as an array of pairs of start and end indices
//  * @returns The sliced array
//  */
// // export function arraySlice(
// //   arr: MultiArray<any>,
// //   dims: Array<[number, number]>
// // ): MultiArray<any> {
// //   // Recursively apply the slicing operation on each dimension
// //   return dims.reduce(
// //     (acc, [a0, a1]) => acc.map((row) => row.slice(a0, a1)),
// //     arr
// //   );
// // }

/**
 * Slices a 2D array.
 *
 * @param arr - The 2D array to slice
 * @param dims - The dimensions to slice, as 2D array of pairs of start and end indices
 * @returns The sliced array
 */
export function arraySlice2D(
  arr: number[][],
  dims: Array<[number, number]>
): number[][] {
  // Recursively apply the slicing operation on each dimension
  return arr
    .slice(dims[0][0], dims[0][1])
    .map((row) => row.slice(dims[1][0], dims[1][1]));
}
// export function arraySlice(
//   arr: MultiArray<any>,
//   dims: Array<[number, number]>
// ): MultiArray<any> {
//   // Recursively apply the slicing operation on each dimension
//   return dims.reduce(
//     (acc, [a0, a1]) => acc.map((row) => row.slice(a0, a1)),
//     arr
//   );
// }
