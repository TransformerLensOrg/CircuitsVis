import { arraySlice2D } from "../arrayOps";

describe("arraySlice", () => {
  it("should slice a 2D array", () => {
    const arr: number[][] = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const dims: [number, number][] = [
      [1, 2],
      [1, 3]
    ];
    const sliced = arraySlice2D(arr, dims);
    expect(sliced).toEqual([[5, 6]]);
  });
  it("should slice a 2D array at the edges", () => {
    const arr: number[][] = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const dims: [number, number][] = [
      [0, 3],
      [0, 3]
    ];
    const sliced = arraySlice2D(arr, dims);
    expect(sliced).toEqual(arr);
  });
});
