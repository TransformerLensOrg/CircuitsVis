import { Rank, tensor, Tensor1D, Tensor3D, reverse, topk as tfTopk } from "@tensorflow/tfjs";
import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { ColoredTokens } from "../tokens/ColoredTokens";
import { getTokenBackgroundColor } from "../utils/getTokenBackgroundColor";

export function NumberSelector({
  smallestNumber = 0,
  largestNumber,
  currentValue,
  setCurrentValue,
  id
}: {
  smallestNumber?: number;
  largestNumber: number;
  currentValue: number;
  setCurrentValue: (num: number) => void;
  id: string;
}) {
  // Initialize an array of numbers smallestNumber-largestNumber
  const options = [...Array(largestNumber - smallestNumber + 1).keys()].map(
    (i) => i + smallestNumber
  );
  // const options = [...Array(largestNumber).keys()];

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

/**
 * Get the selected activations
 *
 * @param activations All activations [ samples x tokens x layers x neurons ]
 * @param layerNumber
 * @param neuronNumber
 */
export function getSelectedActivations(
  activations: Tensor3D,
  layerNumber: number,
  neuronNumber: number
): Tensor1D {
  const currentActivations = activations
    .slice([0, layerNumber, neuronNumber], [-1, 1, 1])
    .squeeze<Tensor1D>([1, 2]); // squeeze out all but the token dimension

  return currentActivations;
}

// Styling for each cell in the table
function tdStyle(value: number): React.CSSProperties {
  // The background color is determined by the activation value
  const backgroundColor = getTokenBackgroundColor(
    value,
    0,
    1,
  ).toRgbString();
  return {
    backgroundColor: backgroundColor,
    border: "1px solid black",
  };
};

export function TopBottomKTable({
  topkActivations,
  bottomkActivations,
  topkTokens,
  bottomkTokens,
}: {
  topkActivations: number[];
  bottomkActivations: number[];
  topkTokens: string[];
  bottomkTokens: string[];
}) {
  // Create a table with a single column corresponding to the topk activations coloured by their activation value
  return (
    <Container fluid>
      {topkActivations.map((activation, index) => (
        <Row key={index}>
          <Col style={tdStyle(activation)}>
            <ColoredTokens
              tokens={[topkTokens[index]]}
              values={[activation]}
              maxValue={1}
              minValue={0}
              paddingBottom={0}
              border={false}
            />
          </Col>
        </Row>
      ))}
      <Row>
        <Col>
          <div style={{ textAlign: "center" }}>...</div>
        </Col>
      </Row>
      {bottomkActivations.map((activation, index) => (
        <Row key={index}>
          <Col style={tdStyle(activation)}>
            <ColoredTokens
              tokens={[bottomkTokens[index]]}
              values={[activation]}
              maxValue={1}
              minValue={0}
              paddingBottom={0}
              border={false}
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
}

/**
 * Show activations (colored by intensity) for each token.
 *
 * Includes drop-downs for layer and neuron numbers.
 */
export function Topk({
  tokens,
  activations,
  k = 5,
  firstDimensionName = "Sample",
  secondDimensionName = "Layer",
  thirdDimensionName = "Neuron"
}: TopkProps) {
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);
  const [sampleNumber, setSampleNumber] = useState<number>(0);

  const activationsTensors = activations.map((sampleActivations) => {
    return tensor<Rank.R3>(sampleActivations);
  });
  // Get number of layers/neurons (Assumes all samples have the same number of layers/neurons)
  const numberOfLayers = activationsTensors[0].shape[1];
  const numberOfNeurons = activationsTensors[0].shape[2];
  const numberOfSamples = activationsTensors.length;

  // Get the relevant activations for the selected sample, layer, and neuron
  const currentActivations: Tensor1D = getSelectedActivations(
    activationsTensors[sampleNumber],
    layerNumber,
    neuronNumber
  );
  const currentTokens: string[] = tokens[sampleNumber];

  const { values: topkValsRaw, indices: topkIdxsRaw } = tfTopk(currentActivations, k, true);
  const { values: bottomkValsRaw, indices: bottomkIdxsRaw } = tfTopk(currentActivations.mul(-1), k, true);
  // const topkVals = (topkValsRaw.arraySync() as number[]);
  const topkVals: number[] = (topkValsRaw.arraySync() as number[]);
  const topkIdxs: number[] = (topkIdxsRaw.arraySync() as number[]);
  // Bottom vals are ordered from highest to lowest activations (just like top vals)
  const bottomkVals: number[] = (reverse(bottomkValsRaw.mul(-1), -1).arraySync() as number[]);
  const bottomkIdxs: number[] = (reverse(bottomkIdxsRaw, -1).arraySync() as number[]);

  // Must type cast to prevent error: " Property 'map' does not exist on type 'number'."
  const topkTokens: string[] = topkIdxs.map((idx) => currentTokens[idx]);
  const bottomkTokens: string[] = bottomkIdxs.map((idx) => currentTokens[idx]);

  return (
    <Container fluid>
      <Row style={{ paddingTop: 5, paddingBottom: 5 }}>
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
      <Row style={{ paddingTop: 5, paddingBottom: 5 }}>
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
      <Row>
        <Col>
          <label htmlFor="neuron-selector" style={{ marginRight: 15 }}>
            {thirdDimensionName}:
          </label>
          <NumberSelector
            id="neuron-selector"
            largestNumber={numberOfNeurons - 1}
            currentValue={neuronNumber}
            setCurrentValue={setNeuronNumber}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 15 }}>
        <TopBottomKTable
          topkActivations={topkVals}
          bottomkActivations={bottomkVals}
          topkTokens={topkTokens}
          bottomkTokens={bottomkTokens}
        />
      </Row>
    </Container>
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
   * Number of top/bottom activations to show
   */
  k?: number;

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
