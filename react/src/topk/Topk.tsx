import {
  Rank,
  tensor,
  Tensor2D,
  Tensor3D,
  reverse,
  topk as tfTopk
} from "@tensorflow/tfjs";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { usePopperTooltip } from "react-popper-tooltip";
import { colord, AnyColor } from "colord";
import { getTokenBackgroundColor } from "../utils/getTokenBackgroundColor";
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
 * Get the selected activations
 *
 * @param {Tensor3D} activations - Activations for the selected sample [ tokens x layers x neurons ]
 * @param {number} layerNumber - Selected layer number
 * @param {number} neuronStartNumber - First selected neuron number
 * @param {number} neuronEndNumber - Last selected neuron number
 * @returns Tensor2D of selected activations [ neurons x tokens ]. This form is required for
 * topk which can only calculate the topk over the final dimension
 */
export function getSelectedActivations(
  activations: Tensor3D,
  layerNumber: number,
  neuronStartNumber: number,
  neuronEndNumber: number
): Tensor2D {
  const currentActivations: Tensor2D = activations
    .slice(
      [0, layerNumber, neuronStartNumber],
      [-1, 1, neuronEndNumber - neuronStartNumber + 1]
    )
    .squeeze<Tensor2D>([1]) // squeeze out the layer dimension
    .transpose(); // transpose so that the tokens are the last dimension (needed for tfjs's topk)
  return currentActivations; // [neurons x tokens]
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
  filter
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
}) {
  return (
    <table style={{ marginTop: 15, marginLeft: 15 }}>
      <thead>
        {/* The first header row just shows the current neuron idx */}
        <tr>
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
              {/* Show the coloured token for each topk activation */}
              {activations.map((activation, neuronIdx) => (
                <TokenCell
                  key={neuronIdx}
                  tdKey={neuronIdx}
                  token={topkTokens[tokenIdx][neuronIdx]}
                  value={activation}
                  minValue={0}
                  maxValue={1}
                  // maxTokenLength={maxTokenLength}
                />
              ))}
            </tr>
          ))}
        {/* Only show the ellipse if filter === "topk+bottomk" */}
        {filter === "topk+bottomk" && (
          <tr>
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
              {/* Show the coloured token for each bottomk activation */}
              {activations.map((activation, neuronIdx) => (
                <TokenCell
                  key={neuronIdx}
                  tdKey={neuronIdx}
                  token={bottomkTokens[tokenIdx][neuronIdx]}
                  value={activation}
                  minValue={0}
                  maxValue={1}
                  // maxTokenLength={maxTokenLength}
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
export function Topk({
  tokens,
  activations,
  firstDimensionName = "Sample",
  secondDimensionName = "Layer",
  thirdDimensionName = "Neuron" // Note that we simply use neuron as variable names throughout this file
}: TopkProps) {
  const activationsTensors = activations.map((sampleActivations) => {
    return tensor<Rank.R3>(sampleActivations);
  });
  // Get number of layers/neurons (Assumes all samples have the same number of layers/neurons)
  const numberOfLayers = activationsTensors[0].shape[1];
  const numberOfNeurons = activationsTensors[0].shape[2];
  const numberOfSamples = activationsTensors.length;

  /** TODO: reqct-hook-form <- investigate */
  const [sampleNumber, setSampleNumber] = useState<number>(0);
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [colsToShow, setColsToShow] = useState<number>(5);
  const [k, setK] = useState<number>(Math.min(5, tokens[0].length));
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
  // Get the relevant activations for the selected sample, layer, and neurons.
  const currentActivations: Tensor2D = getSelectedActivations(
    activationsTensors[sampleNumber],
    layerNumber,
    neuronNumbers[0],
    neuronNumbers[neuronNumbers.length - 1]
  ); // [neurons x tokens]

  const { values: topkValsRaw, indices: topkIdxsRaw } = tfTopk(
    currentActivations,
    k,
    true
  );
  const { values: bottomkValsRaw, indices: bottomkIdxsRaw } = tfTopk(
    currentActivations.mul(-1),
    k,
    true
  );

  // The topk and bottomk values, indices and tokens will be tensors of shape
  // [tokens x neurons]. This form makes it easier to display the table
  const topkVals: number[][] = topkValsRaw
    .transpose()
    .arraySync() as number[][];
  const topkIdxs: number[][] = topkIdxsRaw
    .transpose()
    .arraySync() as number[][];
  // Bottom vals are ordered from highest to lowest activations (just like top vals)
  const bottomkVals: number[][] = reverse(bottomkValsRaw.mul(-1), -1)
    .transpose()
    .arraySync() as number[][];
  const bottomkIdxs: number[][] = reverse(bottomkIdxsRaw, -1)
    .transpose()
    .arraySync() as number[][];

  const topkTokens: string[][] = topkIdxs.map((outerArr) =>
    outerArr.map((token_idx) => currentTokens[token_idx])
  );
  const bottomkTokens: string[][] = bottomkIdxs.map((outerArr) =>
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
                  {firstDimensionName}:
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
                  {secondDimensionName}:
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
                  largestNumber={currentTokens.length}
                  currentValue={k}
                  setCurrentValue={setK}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <TopBottomKTable
        topkActivations={topkVals}
        bottomkActivations={bottomkVals}
        topkTokens={topkTokens}
        bottomkTokens={bottomkTokens}
        neuronNumbers={neuronNumbers}
        filter={filter}
      />
    </div>
  );
}

export interface TopkProps {
  /**
   * List of lists of tokens [ samples x tokens ]
   *
   * Each list must be the same length as the number of activations in the
   * corresponding activations list.
   */
  tokens: string[][];

  /**
   * Activations
   *
   * Should be a nested list of numbers of the form [ samples x tokens x layers x neurons ].
   */
  activations: number[][][][];

  /**
   * Name of the first dimension
   */
  firstDimensionName?: string;

  /**
   * Name of the second dimension
   */
  secondDimensionName?: string;

  /**
   * Name of the third dimension
   */
  thirdDimensionName?: string;
}
