import React from "react";

/**
 * Create an html select with each option corresponding to a single number in a
 * range of numbers.
 *
 * @returns Select element.
 */
export function NumberSelector({
  smallestNumber = 0,
  largestNumber,
  currentValue,
  setCurrentValue,
  id
}: {
  /** Smallest number included in the range */
  smallestNumber?: number;
  /** Largest number included in the range */
  largestNumber: number;
  /** Current value selected */
  currentValue: number;
  /** Function for setting the selected value */
  setCurrentValue: (num: number) => void;
  /** The id of the select */
  id: string;
}) {
  // Initialize an array of numbers smallestNumber-largestNumber
  const options = [...Array(largestNumber - smallestNumber + 1).keys()].map(
    (i) => i + smallestNumber
  );

  return (
    <select
      value={currentValue}
      onChange={(event) => setCurrentValue(Number(event.target.value))}
      id={id}
    >
      {options.map((value) => (
        <option key={value}>{value}</option>
      ))}
    </select>
  );
}
