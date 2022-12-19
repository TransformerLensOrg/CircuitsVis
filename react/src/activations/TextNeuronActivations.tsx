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

/**
 * Show the lists of tokens, colored by their activation value.
 * Each sample is displayed in a separate box, unless there is only one sample.
 *
 * @returns A div element
 */
export function Items({
  activationsList,
  tokensList
}: {
  activationsList: number[][] | null;
  tokensList: string[][] | null;
}) {
  // Styling for the background of the samples
  const boxedSampleStyle = {
    border: "1px solid black",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5"
  };
  // For each set of activations in activationsList, show the
  // corresponding ColoredTokens objects in separate raised boxes
  // If there is only a single set of activations don't show the box.
  return (
    <div>
      {activationsList &&
        tokensList &&
        activationsList.length > 1 &&
        activationsList.map((activations, index) => (
          <Row key={index}>
            <Col style={boxedSampleStyle}>
              <ColoredTokens
                tokens={tokensList[index]}
                values={activations}
                paddingBottom={0}
              />
            </Col>
          </Row>
        ))}
      {activationsList && tokensList && activationsList.length === 1 && (
        <Row key={0}>
          <Col>
            <ColoredTokens tokens={tokensList[0]} values={activationsList[0]} />
          </Col>
        </Row>
      )}
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
  // If there is only one sample (i.e. if tokens is an array of strings), cast tokens and activations to an array with
  // a single element
  const tokensList: string[][] =
    typeof tokens[0] === "string"
      ? ([tokens] as string[][])
      : (tokens as string[][]);
  const activationsList: number[][][][] =
    typeof activations[0][0][0] === "number"
      ? ([activations] as number[][][][])
      : (activations as number[][][][]);

  // Convert the activations to a tensor
  const activationsTensors = activationsList.map((sampleActivations) => {
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
    return tokensList[sampleNumber];
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
          {/* Only show the sample selector if there is more than one sample */}
          {numberOfSamples > 1 && (
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
          )}
        </Col>
        <Col>
          {/* Only show the sample per page selector if there is more than one sample */}
          {numberOfSamples > 1 && (
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
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Items
            activationsList={selectedActivations}
            tokensList={selectedTokens}
          />
        </Col>
      </Row>
    </Container>
  );
}

export interface TextNeuronActivationsProps {
  /**
   * List of lists of tokens (if multiple samples) or a list of tokens (if
   * single sample)
   *
   * If multiple samples, each list must be the same length as the number of activations in the
   * corresponding activations list.
   */
  tokens: string[][] | string[];

  /**
   * Activations
   *
   * If multiple samples, will be a nested list of numbers, of the form [ sample x tokens x layers x neurons
   * ]. If a single sample, will be a list of numbers of the form [ tokens x layers x neurons ].
   */
  activations: number[][][][] | number[][][];

  /**
   * Name of the first dimension
   */
  firstDimensionName?: string;

  /**
   * Name of the second dimension
   */
  secondDimensionName?: string;
}
