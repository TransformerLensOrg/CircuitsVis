import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { usePopperTooltip } from "react-popper-tooltip";
import { colord, AnyColor } from "colord";
import { getTokenBackgroundColor } from "../utils/getTokenBackgroundColor";
import { arraySlice2D } from "../utils/arrayOps";
import { RangeSelector } from "../shared/RangeSelector";
import { NumberSelector } from "../shared/NumberSelector";

/**
 * Create a grid cell containing the token coloured by its activation value.
 *
 * @returns A td element.
 */
export function TokenCell({
  tdKey,
  token,
  value,
  minValue,
  maxValue,
  negativeColor,
  positiveColor
}: {
  /** The td key */
  tdKey: number;
  /** The token to display */
  token: string;
  /** The value to use for the token's background color and tooltip display */
  value: number;
  /** The minimum value for setting the colour scheme */
  minValue: number;
  /** The maximum value for setting the colour scheme */
  maxValue: number;
  /** The color to use for negative values */
  negativeColor?: AnyColor;
  /** The color to use for positive values */
  positiveColor?: AnyColor;
}) {
  // Hover state
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      followCursor: true
    });

  const backgroundColor: string = getTokenBackgroundColor(
    value,
    minValue,
    maxValue,
    negativeColor,
    positiveColor
  ).toRgbString();

  const textColor: string =
    colord(backgroundColor).brightness() < 0.6 ? "white" : "black";

  const tokenReplaceSpaces = token.replace(/\s/g, "&nbsp;");
  const tokenReplaceLineBreaks = tokenReplaceSpaces.replace(/\n/g, "¶");

  return (
    <td
      key={tdKey}
      style={{
        backgroundColor,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black"
      }}
    >
      <span
        ref={setTriggerRef}
        style={{ display: "block", color: textColor }}
        dangerouslySetInnerHTML={{ __html: tokenReplaceLineBreaks }}
      ></span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            style: {
              background: "#333",
              color: "white",
              textAlign: "center",
              padding: 10,
              borderRadius: 5,
              boxShadow: "5px 5px rgba(0, 0, 0, 0.03)",
              marginTop: 15,
              zIndex: 1
            }
          })}
        >
          <strong>{token}</strong>
          <br />
          {value}
        </div>
      )}
    </td>
  );
}

/**
 * Create a table with the topk and bottomk tokens for each neuron in the selected range.
 *
 * @returns A html table element containing the topk table.
 */
export function TopBottomKTable({
  topkActivations,
  bottomkActivations,
  topkTokens,
  bottomkTokens,
  neuronNumbers,
  filter,
  colLabel
}: {
  /** Topk activations for the selected sample and neuron numbers [ tokens x neurons ] */
  topkActivations: number[][];
  /** Bottomk activations for the selected sample and neuron numbers [ tokens x neurons ] */
  bottomkActivations: number[][];
  /** Topk tokens for the selected sample and neuron numbers [ tokens x neurons ] */
  topkTokens: string[][];
  /** Bottomk tokens for the selected sample and neuron numbers [ tokens x neurons ] */
  bottomkTokens: string[][];
  /** The neuron numbers we wish to display (each will have its own column) */
  neuronNumbers: number[];
  /** Indicates whether to show topk, bottomk or both. */
  filter: string;
  /** The column label to use for the table */
  colLabel: string;
}) {
  return (
    <table style={{ marginTop: 15, marginLeft: 15 }}>
      <thead>
        <tr>
          {/* Label for all columns */}
          <th
            colSpan={neuronNumbers.length + 1}
            style={{ textAlign: "center", paddingLeft: "9ch" }}
          >
            {colLabel}
          </th>
        </tr>
        {/* The header row just shows the current neuron idx */}
        <tr>
          <th key="default" style={{ textAlign: "center" }}></th>
          {neuronNumbers.map((neuronNumber) => (
            <th key={neuronNumber} style={{ textAlign: "center" }}>
              {neuronNumber}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Only show the top activations if the filter contains the substring "topk" */}
        {filter.includes("topk") &&
          topkActivations.map((activations, tokenIdx) => (
            <tr key={tokenIdx}>
              {tokenIdx === 0 && (
                <td
                  key="default"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                  rowSpan={topkActivations.length}
                >
                  Topk &darr;
                </td>
              )}
              {/* Show the coloured token for each topk activation */}
              {activations.map((activation, neuronIdx) => (
                <TokenCell
                  key={neuronIdx}
                  tdKey={neuronIdx}
                  token={topkTokens[tokenIdx][neuronIdx]}
                  value={activation}
                  minValue={0}
                  maxValue={1}
                />
              ))}
            </tr>
          ))}
        {/* Only show the ellipses if filter === "topk+bottomk" */}
        {filter === "topk+bottomk" && (
          <tr>
            {/* First add empty space for the label column */}
            <td key="default" style={{ textAlign: "center" }}></td>
            {/* Add an ellipse for each column */}
            {Array(topkActivations[0].length)
              .fill(0)
              .map((_, idx) => (
                <td key={idx}>
                  <div style={{ textAlign: "center" }}>...</div>
                </td>
              ))}
          </tr>
        )}
        {filter.includes("bottomk") &&
          bottomkActivations.map((activations, tokenIdx) => (
            <tr key={tokenIdx}>
              {tokenIdx === 0 && (
                <td
                  key="default"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                  rowSpan={bottomkActivations.length}
                >
                  Bottomk &darr;
                </td>
              )}
              {/* Show the coloured token for each bottomk activation */}
              {activations.map((activation, neuronIdx) => (
                <TokenCell
                  key={neuronIdx}
                  tdKey={neuronIdx}
                  token={bottomkTokens[tokenIdx][neuronIdx]}
                  value={activation}
                  minValue={0}
                  maxValue={1}
                />
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

/**
 * Show the topk and bottomk tokens for each neuron/directions.
 *
 * Includes drop-downs for k, layer and neuron numbers, and the number of
 * columns to show (representing the neurons or directions).
 */
export function TopkTokens({
  tokens,
  topkVals,
  topkIdxs,
  bottomkVals,
  bottomkIdxs,
  firstDimensionName = "Layer",
  thirdDimensionName = "Neuron" // Note that we simply use neuron for variable names throughout this file
}: TopkTokensProps) {
  const numberOfSamples = topkVals.length;
  const numberOfLayers = topkVals[0].length;
  const maxk = topkVals[0][0].length;
  const numberOfNeurons = topkVals[0][0][0].length;

  /** TODO: reqct-hook-form <- investigate */
  const [sampleNumber, setSampleNumber] = useState<number>(0);
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [colsToShow, setColsToShow] = useState<number>(5);
  const [k, setK] = useState<number>(maxk);
  const [neuronNumbers, setNeuronNumbers] = useState<number[]>([
    ...Array(colsToShow).keys()
  ]);
  // Filter for whether to show the topk, bottomk or both (written as "bottomk+topk")
  const [filter, setFilter] = useState<string>("topk+bottomk");

  useEffect(() => {
    // When the user changes the colsToShow, update the neuronNumbers
    setNeuronNumbers(numberOfSamples > 1 ? [...Array(colsToShow).keys()] : [0]);
  }, [colsToShow, numberOfSamples]);

  const currentTokens: string[] = tokens[sampleNumber];
  // Start-end ranges for the slice of the topk/bottomk arrays
  const dimRanges: [number, number][] = [
    [0, k],
    [neuronNumbers[0], neuronNumbers[neuronNumbers.length - 1] + 1]
  ];
  const currentTopkVals: number[][] = arraySlice2D(
    topkVals[sampleNumber][layerNumber],
    dimRanges
  );
  const currentTopkIdxs: number[][] = arraySlice2D(
    topkIdxs[sampleNumber][layerNumber],
    dimRanges
  );
  const currentBottomkVals: number[][] = arraySlice2D(
    bottomkVals[sampleNumber][layerNumber],
    dimRanges
  );
  const currentBottomkIdxs: number[][] = arraySlice2D(
    bottomkIdxs[sampleNumber][layerNumber],
    dimRanges
  );

  const topkTokens: string[][] = currentTopkIdxs.map((outerArr) =>
    outerArr.map((token_idx) => currentTokens[token_idx])
  );
  const bottomkTokens: string[][] = currentBottomkIdxs.map((outerArr) =>
    outerArr.map((token_idx) => currentTokens[token_idx])
  );

  const selectRowStyle = {
    paddingTop: 5,
    paddingBottom: 5
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <Row style={selectRowStyle}>
              <Col>
                <label htmlFor="sample-selector" style={{ marginRight: 15 }}>
                  Sample:
                </label>
                <NumberSelector
                  id="sample-selector"
                  smallestNumber={0}
                  largestNumber={numberOfSamples - 1}
                  currentValue={sampleNumber}
                  setCurrentValue={setSampleNumber}
                />
              </Col>
            </Row>
            <Row style={selectRowStyle}>
              <Col>
                <label htmlFor="layer-selector" style={{ marginRight: 15 }}>
                  {firstDimensionName}:
                </label>
                <NumberSelector
                  id="layer-selector"
                  largestNumber={numberOfLayers - 1}
                  currentValue={layerNumber}
                  setCurrentValue={setLayerNumber}
                />
              </Col>
            </Row>
            <Row style={selectRowStyle}>
              <Col>
                <label htmlFor="neuron-selector" style={{ marginRight: 15 }}>
                  {thirdDimensionName}:
                </label>
                <RangeSelector
                  id="neuron-selector"
                  largestNumber={numberOfNeurons - 1}
                  currentRangeArr={neuronNumbers}
                  setCurrentValue={setNeuronNumbers}
                  numValsInRange={colsToShow}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row style={selectRowStyle}>
              <Col>
                <label htmlFor="filter-select" style={{ marginRight: 15 }}>
                  Filter:
                </label>
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  id="filter-select"
                >
                  <option value={undefined}>topk+bottomk</option>
                  <option value="topk">topk</option>
                  <option value="bottomk">bottomk</option>
                </select>
              </Col>
            </Row>
            <Row style={selectRowStyle}>
              <Col>
                <label
                  htmlFor="visibleCols-selector"
                  style={{ marginRight: 15 }}
                >
                  {thirdDimensionName}s to show:
                </label>
                <NumberSelector
                  id="visible-cols-selector"
                  smallestNumber={1}
                  largestNumber={numberOfNeurons}
                  currentValue={colsToShow}
                  setCurrentValue={setColsToShow}
                />
              </Col>
            </Row>
            <Row style={selectRowStyle}>
              <Col>
                <label htmlFor="k-selector" style={{ marginRight: 15 }}>
                  k:
                </label>
                <NumberSelector
                  id="k-selector"
                  smallestNumber={1}
                  largestNumber={maxk}
                  currentValue={k}
                  setCurrentValue={setK}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <TopBottomKTable
        topkActivations={currentTopkVals}
        bottomkActivations={currentBottomkVals}
        topkTokens={topkTokens}
        bottomkTokens={bottomkTokens}
        neuronNumbers={neuronNumbers}
        filter={filter}
        colLabel={thirdDimensionName}
      />
    </div>
  );
}

export interface TopkTokensProps {
  /**
   * List of lists of tokens [ samples x tokens ]
   *
   * Each list must be the same length as the number of activations in the
   * corresponding activations list.
   */
  tokens: string[][];

  /**
   * Topk values
   *
   * Nested list of activation values of the form [ samples x layers x k x neurons].
   */
  topkVals: number[][][][];

  /**
   * Topk indices
   *
   * Nested list of token indices of the form [ samples x layers x k x neurons].
   */
  topkIdxs: number[][][][];

  /**
   * Bottomk values
   *
   * Nested list of activation values of the form [ samples x layers x k x neurons].
   */
  bottomkVals: number[][][][];

  /**
   * Bottomk indices
   *
   * Nested list of token indices of the form [ samples x layers x k x neurons].
   */
  bottomkIdxs: number[][][][];

  /**
   * Name of the first dimension
   */
  firstDimensionName?: string;

  /**
   * Name of the third dimension
   */
  thirdDimensionName?: string;
}
