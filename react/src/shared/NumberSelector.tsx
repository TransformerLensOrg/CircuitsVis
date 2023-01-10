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
  id,
  labels
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
  /** Labels for each option */
  labels?: string[];
}) {
  // Initialize an array of numbers smallestNumber-largestNumber
  const options = [...Array(largestNumber - smallestNumber + 1).keys()].map(
    (i) => i + smallestNumber
  );
  // If no labels are provided or the length of labels is not equal to the length of options, use the numbers as the labels.
  const resolvedLabels =
    labels && labels.length === options.length
      ? labels
      : options.map((i) => i.toString());
  return (
    <select
      value={currentValue}
      onChange={(event) => setCurrentValue(Number(event.target.value))}
      id={id}
    >
      {/* If no labels are provided, use the numbers as the labels. */}
      {options.map((value, index) => (
        <option key={value} value={value}>
          {resolvedLabels[index]}
        </option>
      ))}
    </select>
  );
}
