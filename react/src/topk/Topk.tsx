import { Rank, tensor, Tensor1D, Tensor3D } from "@tensorflow/tfjs";
import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { ColoredTokens } from "../tokens/ColoredTokens";


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
): number[] {
  const currentActivations = activations
    .slice([0, layerNumber, neuronNumber], [-1, 1, 1])
    .squeeze<Tensor1D>([1, 2]); // squeeze out all but the token dimension

  return currentActivations.arraySync();
}

// Styling for the background of the samples
const boxedSampleStyle = {
  border: "1px solid black",
  borderRadius: 5,
  padding: 10,
  marginTop: 10,
  marginBottom: 10,
  backgroundColor: "#f5f5f5"
};

export function Items({
  visibleActivations,
  visibleTokens
}: {
  visibleActivations: number[][] | null;
  visibleTokens: string[][] | null;
}) {
  // For each set of activations in visibleActivations, show the
  // corresponding ColoredTokens objects in separate raised boxes
  return (
    <div>
      {visibleActivations &&
        visibleTokens &&
        visibleActivations.map((sampleActivations, index) => (
          <Row key={index}>
            <Col style={boxedSampleStyle}>
              <ColoredTokens
                tokens={visibleTokens[index]}
                values={sampleActivations}
              />
            </Col>
          </Row>
        ))}
    </div>
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
  firstDimensionName = "Layer",
  secondDimensionName = "Neuron"
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
  const currentActivations: number[] = getSelectedActivations(
    activationsTensors[sampleNumber],
    layerNumber,
    neuronNumber
  );
  const currentTokens: string[] = tokens[sampleNumber];

  return (
    <Container fluid>
      <Row style={{ paddingTop: 5, paddingBottom: 5 }}>
        <Col>
          <label htmlFor="sample-selector" style={{ marginRight: 15 }}>
            Sample
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
      <Row>
        <Col>
          <label htmlFor="neuron-selector" style={{ marginRight: 15 }}>
            {secondDimensionName}:
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
        <Col>
          <ColoredTokens tokens={currentTokens} values={currentActivations} />
        </Col>
      </Row>
    </Container>
  );
}

export interface TopkProps {
  /**
   * List of lists of tokens
   *
   * Each list must be the same length as the number of activations in the
   * corresponding activations list.
   */
  tokens: string[][];

  /**
   * Activations
   *
   * Should be a nested list of numbers, of the form [ sample x tokens x layers x neurons
   * ].
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
}
