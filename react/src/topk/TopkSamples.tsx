import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { SampleItems } from "../shared/SampleItems";
import { RangeSelector } from "../shared/RangeSelector";
import { NumberSelector } from "../shared/NumberSelector";
import { minMaxInNestedArray } from "../utils/arrayOps";

/**
 * List of samples in descending order of max token activation value for the
 * selected layer and neuron (or whatever other dimension names are specified).
 */
export function TopkSamples({
  tokens,
  activations,
  zerothDimensionName = "Layer",
  firstDimensionName = "Neuron",
  zerothDimensionLabels,
  firstDimensionLabels
}: TopkSamplesProps) {
  const numberOfLayers = activations.length;
  const numberOfNeurons = activations[0].length;
  const numberOfSamples = activations[0][0].length;

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

  // Get the relevant activations for the selected layer and neuron.
  const selectedActivations: number[][] = sampleNumbers.map((sampleNumber) => {
    return activations[layerNumber][neuronNumber][sampleNumber];
  });
  const selectedTokens: string[][] = sampleNumbers.map((sampleNumber) => {
    return tokens[layerNumber][neuronNumber][sampleNumber];
  });

  // For a consistent color scale across all samples in this layer and neuron
  const [minValue, maxValue] = minMaxInNestedArray(
    activations[layerNumber][neuronNumber]
  );

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
                {zerothDimensionName}:
              </label>
              <NumberSelector
                id="layer-selector"
                largestNumber={numberOfLayers! - 1}
                currentValue={layerNumber}
                setCurrentValue={setLayerNumber}
                labels={zerothDimensionLabels}
              />
            </Col>
          </Row>
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
                labels={firstDimensionLabels}
              />
            </Col>
          </Row>
          {/* Only show the sample selector if there is more than one sample */}
          {numberOfSamples > 1 && (
            <Row style={selectRowStyle}>
              <Col>
                <label htmlFor="sample-selector" style={{ marginRight: 15 }}>
                  Samples (descending):
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
          <SampleItems
            activationsList={selectedActivations}
            tokensList={selectedTokens}
            minValue={minValue}
            maxValue={maxValue}
          />
        </Col>
      </Row>
    </Container>
  );
}

export interface TopkSamplesProps {
  /**
   * Nested list of tokens of shape [layers x neurons x samples x tokens]
   *
   * The inner most dimension must be the same size as the inner most dimension of activations.
   *
   * For example, the first and second dimensisons (1-indexed) may correspond to
   * layers and neurons.
   */
  tokens: string[][][][];

  /**
   * Activations for the tokens with shape [layers x neurons x samples x tokens]
   *
   */
  activations: number[][][][];

  /**
   * Name of the zeroth dimension
   */
  zerothDimensionName?: string;

  /**
   * Name of the first dimension
   */
  firstDimensionName?: string;

  /**
   * Labels for the zeroth dimension
   */
  zerothDimensionLabels?: string[];

  /**
   * Labels for the first dimension
   */
  firstDimensionLabels?: string[];
}
