import { arraySlice2D, minMaxInNestedArray } from "../arrayOps";

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

describe("minMaxInNestedArray", () => {
  it("should return minimum and maximum values for a flat array", () => {
    const arr: number[] = [1, 2, 3, 4, 5];
    const [min, max] = minMaxInNestedArray(arr);
    expect(min).toEqual(1);
    expect(max).toEqual(5);
  });

  it("should return minimum and maximum values for a nested array", () => {
    const arr: any[] = [1, 2, 3, [4, 5, [6, 7]], 8];
    const [min, max] = minMaxInNestedArray(arr);
    expect(min).toEqual(1);
    expect(max).toEqual(8);
  });

  it("should return minimum and maximum values for a deeply nested array", () => {
    const arr: any[] = [[[[1]]], 2, 3, [[4]]];
    const [min, max] = minMaxInNestedArray(arr);
    expect(min).toEqual(1);
    expect(max).toEqual(4);
  });

  it("should return 0 and 1 for an empty array", () => {
    const arr: any[] = [];
    const [min, max] = minMaxInNestedArray(arr);
    expect(min).toEqual(0);
    expect(max).toEqual(1);
  });
});
