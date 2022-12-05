import { Rank, tensor, Tensor1D, Tensor3D } from "@tensorflow/tfjs";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { ColoredTokens } from "../tokens/ColoredTokens";
import { RangeSelector } from "../shared/RangeSelector";
import { NumberSelector } from "../shared/NumberSelector";

/**
 * Get the selected activations
 *
 * @param activations All activations [ tokens x layers x neurons ]
 * @param layerNumber
 * @param neuronNumber
 */
export function getSelectedActivations(
  activations: Tensor3D,
  layerNumber: number,
  neuronNumber: number
): number[] {
  const relevantActivations = activations
    .slice([0, layerNumber, neuronNumber], [-1, 1, 1])
    .squeeze<Tensor1D>([1, 2]);
  return relevantActivations.arraySync();
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
  selectedActivations,
  selectedTokens
}: {
  selectedActivations: number[][] | null;
  selectedTokens: string[][] | null;
}) {
  // For each set of activations in selectedActivations, show the
  // corresponding ColoredTokens objects in separate raised boxes
  return (
    <div>
      {selectedActivations &&
        selectedTokens &&
        selectedActivations.map((sampleActivations, index) => (
          <Row key={index}>
            <Col style={boxedSampleStyle}>
              <ColoredTokens
                tokens={selectedTokens[index]}
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
export function TextNeuronActivations({
  tokens,
  activations,
  firstDimensionName = "Layer",
  secondDimensionName = "Neuron"
}: TextNeuronActivationsProps) {
  // Convert the activations to a tensor
  const activationsTensors = activations.map((sampleActivations) => {
    return tensor<Rank.R3>(sampleActivations);
  });

  // Get number of layers/neurons
  const numberOfLayers = activationsTensors[0].shape[1];
  const numberOfNeurons = activationsTensors[0].shape[2];
  const numberOfSamples = activationsTensors.length;

  const [samplesPerPage, setSamplesPerPage] = useState<number>(
    Math.min(5, numberOfSamples)
  );
  const [sampleNumbers, setSampleNumbers] = useState<number[]>([
    ...Array(samplesPerPage).keys()
  ]);
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);

  useEffect(() => {
    // When the user changes the samplesPerPage, update the sampleNumbers
    setSampleNumbers([...Array(samplesPerPage).keys()]);
  }, [samplesPerPage]);

  // Get the relevant activations for the selected samples, layer, and neuron.
  const selectedActivations: number[][] = sampleNumbers.map((sampleNumber) => {
    return getSelectedActivations(
      activationsTensors[sampleNumber],
      layerNumber,
      neuronNumber
    );
  });

  const selectedTokens: string[][] = sampleNumbers.map((sampleNumber) => {
    return tokens[sampleNumber];
  });

  const selectRowStyle = {
    paddingTop: 5,
    paddingBottom: 5
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Row style={selectRowStyle}>
            <Col>
              <label htmlFor="layer-selector" style={{ marginRight: 15 }}>
                {firstDimensionName}:
              </label>
              <NumberSelector
                id="layer-selector"
                largestNumber={numberOfLayers! - 1}
                currentValue={layerNumber}
                setCurrentValue={setLayerNumber}
              />
            </Col>
          </Row>
          <Row style={selectRowStyle}>
            <Col>
              <label htmlFor="neuron-selector" style={{ marginRight: 15 }}>
                {secondDimensionName}:
              </label>
              <NumberSelector
                id="neuron-selector"
                largestNumber={numberOfNeurons! - 1}
                currentValue={neuronNumber}
                setCurrentValue={setNeuronNumber}
              />
            </Col>
          </Row>
          <Row style={selectRowStyle}>
            <Col>
              <label htmlFor="sample-selector" style={{ marginRight: 15 }}>
                Samples:
              </label>
              <RangeSelector
                id="sample-selector"
                largestNumber={numberOfSamples - 1}
                currentRangeArr={sampleNumbers}
                setCurrentValue={setSampleNumbers}
                numValsInRange={samplesPerPage}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row style={selectRowStyle}>
            <Col>
              <label
                htmlFor="samples-per-page-selector"
                style={{ marginRight: 15 }}
              >
                Samples per page:
              </label>
              <NumberSelector
                id="samples-per-page-selector"
                smallestNumber={1}
                largestNumber={numberOfSamples}
                currentValue={samplesPerPage}
                setCurrentValue={setSamplesPerPage}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Items
        selectedActivations={selectedActivations}
        selectedTokens={selectedTokens}
      />
    </Container>
  );
}

export interface TextNeuronActivationsProps {
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
