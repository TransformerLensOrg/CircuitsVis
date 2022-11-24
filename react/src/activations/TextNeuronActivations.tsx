import { Rank, tensor, Tensor1D, Tensor3D } from "@tensorflow/tfjs";
import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { ColoredTokens } from "../tokens/ColoredTokens";

export function NumberSelector({
  largestNumber,
  currentValue,
  setCurrentValue,
  id
}: {
  largestNumber: number;
  currentValue: number;
  setCurrentValue: (num: number) => void;
  id: string;
}) {
  // Initialize an array of numbers 0-largestNumber
  const options = [...Array(largestNumber).keys()];

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
  const relevantActivations = activations
    .slice([0, layerNumber, neuronNumber], [-1, 1, 1])
    .squeeze<Tensor1D>([1, 2]); // squeeze out all but the token dimension

  return relevantActivations.arraySync();
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
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);

  const activationsTensors = activations.map((sampleActivations) => {
    return tensor<Rank.R3>(sampleActivations);
  });
  // Get number of layers/neurons (Assumes all samples have the same number of layers/neurons)
  const numberOfLayers = activationsTensors[0].shape[1];
  const numberOfNeurons = activationsTensors[0].shape[2];

  // Get the relevant activations for each sample
  const relevantActivations: number[][] = activationsTensors.map(
    (sampleActivations) => {
      return getSelectedActivations(
        sampleActivations,
        layerNumber,
        neuronNumber
      );
    }
  );

  const boxedSampleStyle = {
    border: "1px solid black",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5"
  };

  return (
    <Container fluid>
      <Row style={{ paddingTop: 5, paddingBottom: 5 }}>
        <Col>
          <label htmlFor="layer-selector" style={{ marginRight: 15 }}>
            {firstDimensionName}:
          </label>
          <NumberSelector
            id="layer-selector"
            largestNumber={numberOfLayers!}
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
            largestNumber={numberOfNeurons!}
            currentValue={neuronNumber}
            setCurrentValue={setNeuronNumber}
          />
        </Col>
      </Row>
      {/* For each set of activations in relevantActivations, show the corresponding ColoredTokens objects in separate raised boxes */}
      {relevantActivations.map((sampleActivations, index) => {
        return (
          <Row key={index}>
            <Col style={boxedSampleStyle}>
              <ColoredTokens
                tokens={tokens[index]}
                values={sampleActivations}
              />
            </Col>
          </Row>
        );
      })}
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
