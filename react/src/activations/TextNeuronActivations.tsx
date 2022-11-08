import { Rank, tensor, Tensor1D, Tensor3D } from "@tensorflow/tfjs";
import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import tinycolor from "tinycolor2";

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

export function Token({
  token,
  activation
}: {
  token: string;
  activation: number;
}) {
  const backgroundColor = tinycolor({
    h: 0,
    s: 1,
    l: 1 - activation
  }).toRgbString();

  return (
    <span
      style={{ display: "inline-block", backgroundColor, whiteSpace: "pre" }}
    >
      {token}
    </span>
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

export function Tokens({
  activations,
  tokens,
  layerNumber,
  neuronNumber
}: {
  /** Activations [ tokens x layers x neurons ] */
  activations: Tensor3D;
  tokens: string[];
  layerNumber: number;
  neuronNumber: number;
}) {
  // Get the relevant activations
  const relevantActivations: number[] = getSelectedActivations(
    activations,
    layerNumber,
    neuronNumber
  );
  return (
    <p>
      {tokens.map((token, idx) => (
        <Token key={idx} token={token} activation={relevantActivations[idx]} />
      ))}
    </p>
  );
}

/**
 * Show activations (colored by intensity) for each token in some text
 *
 * Includes drop-downs for layer and neuron numbers.
 */
export function TextNeuronActivations({
  tokens,
  activations
}: {
  tokens: string[];
  /** Activations [ tokens x layers x neurons ] */
  activations: number[][][];
}) {
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);

  // Convert the activations to a tensor
  const activationsTensor = tensor<Rank.R3>(activations);

  // Get number of layers/neurons
  const numberOfLayers = activationsTensor.shape[1];
  const numberOfNeurons = activationsTensor.shape[2];

  return (
    <Container>
      <Row>
        <Col>
          <label htmlFor="layer-selector" style={{ marginRight: 15 }}>
            Layer Number:
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
            Neuron Number:
          </label>
          <NumberSelector
            id="neuron-selector"
            largestNumber={numberOfNeurons!}
            currentValue={neuronNumber}
            setCurrentValue={setNeuronNumber}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Tokens
            tokens={tokens}
            activations={activationsTensor}
            layerNumber={layerNumber}
            neuronNumber={neuronNumber}
          />
        </Col>
      </Row>
    </Container>
  );
}
