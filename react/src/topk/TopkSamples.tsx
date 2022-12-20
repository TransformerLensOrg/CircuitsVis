import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { SampleItems } from "../shared/SampleItems";
import { RangeSelector } from "../shared/RangeSelector";
import { NumberSelector } from "../shared/NumberSelector";

/**
 * Show activations (colored by intensity) for each token.
 *
 * Includes drop-downs for layer and neuron numbers.
 */
export function TopkSamples({
  tokens,
  activations,
  firstDimensionName = "Neuron",
  secondDimensionName = "k"
}: TopkSamplesProps) {
  const numberOfNeurons = activations.length;
  const numberOfSamples = activations[0].length;
  // // Convert the activations to a tensor
  // const activationsTensors = activations.map((sampleActivations) => {
  //   return tensor<Rank.R3>(sampleActivations);
  // });

  // // Get number of layers/neurons
  // const numberOfLayers = activationsTensors[0].shape[1];
  // const numberOfNeurons = activationsTensors[0].shape[2];
  // const numberOfSamples = activationsTensors.length;
  // console.log(tokens);
  // console.log(activations);
  // console.log(numberOfNeurons);
  // console.log(numberOfSamples);
  const [samplesPerPage, setSamplesPerPage] = useState<number>(
    Math.min(5, numberOfSamples)
  );
  const [sampleNumbers, setSampleNumbers] = useState<number[]>([
    ...Array(samplesPerPage).keys()
  ]);
  // const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);

  useEffect(() => {
    // When the user changes the samplesPerPage, update the sampleNumbers
    setSampleNumbers([...Array(samplesPerPage).keys()]);
  }, [samplesPerPage]);

  // Get the relevant activations for the selected neuron.
  const selectedActivations: number[][] = sampleNumbers.map((sampleNumber) => {
    return activations[neuronNumber][sampleNumber];
  });
  // const selectedActivations: number[][] = activations[neuronNumber]
  // // const selectedActivations: number[][] = sampleNumbers.map((sampleNumber) => {
  // //   return getSelectedActivations(
  // //     activationsTensors[sampleNumber],
  // //     layerNumber,
  // //     neuronNumber
  // //   );
  // // });

  const selectedTokens: string[][] = sampleNumbers.map((sampleNumber) => {
    return tokens[neuronNumber][sampleNumber];
  });
  // const selectedTokens: string[][] = tokens[neuronNumber];

  // const selectedTokens: string[][] = sampleNumbers.map((sampleNumber) => {
  //   return tokens[sampleNumber];
  // });

  const selectRowStyle = {
    paddingTop: 5,
    paddingBottom: 5
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          {/* <Row style={selectRowStyle}>
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
          </Row> */}
          <Row style={selectRowStyle}>
            <Col>
              <label htmlFor="neuron-selector" style={{ marginRight: 15 }}>
                {firstDimensionName}:
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
                  {secondDimensionName}:
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
                  {secondDimensionName}s per page:
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
          <SampleItems
            activationsList={selectedActivations}
            tokensList={selectedTokens}
          />
        </Col>
      </Row>
    </Container>
  );
}

export interface TopkSamplesProps {
  /**
   * Nested list of tokens
   *
   * The inner most dimension must be the same size as the inner most dimension of activations.
   *
   * For example, the first and second dimensisons (1-indexed) may correspond to
   * neurons and topk indices.
   */
  tokens: string[][][];

  /**
   * Activations for the tokens above.
   *
   */
  activations: number[][][];

  /**
   * Name of the first dimension
   */
  firstDimensionName?: string;

  /**
   * Name of the second dimension
   */
  secondDimensionName?: string;
}
