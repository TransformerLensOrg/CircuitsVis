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
 * Show activations (colored by intensity) for each token in some text
 *
 * Includes drop-downs for layer and neuron numbers.
 */
export function TextNeuronActivations({
  tokens,
  activations,
  firstDimensionName = "Layer",
  secondDimensionName = "Neuron"
}: {
  tokens: string[];
  /** Activations [ tokens x layers x neurons ] */
  activations: number[][][];
  firstDimensionName?: string;
  secondDimensionName?: string;
}) {
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);

  // Convert the activations to a tensor
  const activationsTensor = tensor<Rank.R3>(activations);

  // Get number of layers/neurons
  const numberOfLayers = activationsTensor.shape[1];
  const numberOfNeurons = activationsTensor.shape[2];

  // Get the relevant activations
  const relevantActivations: number[] = getSelectedActivations(
    activationsTensor,
    layerNumber,
    neuronNumber
  );

  return (
    <Container fluid>
      <Row>
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

      <Row style={{ marginTop: 15 }}>
        <Col>
          <ColoredTokens tokens={tokens} values={relevantActivations} />
        </Col>
      </Row>
    </Container>
  );
}
