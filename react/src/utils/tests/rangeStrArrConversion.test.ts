import { rangeArrToString, rangeStringToArr } from "../rangeStrArrConversion";

describe("convertRangeArrToString", () => {
  it("converts a single number range array to a string", () => {
    expect(rangeArrToString([1])).toBe("1");
  });

  it("converts a two number range array to a string", () => {
    expect(rangeArrToString([1, 2])).toBe("1-2");
  });

  it("converts a multi number range array to a string", () => {
    // Note how this function doesn't check to see if the array contains consecutive numbers
    expect(rangeArrToString([3, 4, 5, 9])).toBe("3-9");
  });
});

describe("convertRangeStringToArr", () => {
  it("converts a single number", () => {
    expect(rangeStringToArr("1")).toEqual([1]);
  });

  it("converts two consecutive numbers", () => {
    expect(rangeStringToArr("1-2")).toEqual([1, 2]);
  });

  it("converts non-consecutive numbers", () => {
    expect(rangeStringToArr("3-9")).toEqual([3, 4, 5, 6, 7, 8, 9]);
  });
});
