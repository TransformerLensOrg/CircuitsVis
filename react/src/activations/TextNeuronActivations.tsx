import ReactPaginate from "react-paginate";
import { Rank, tensor, Tensor1D, Tensor3D } from "@tensorflow/tfjs";
import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { ColoredTokens } from "../tokens/ColoredTokens";
import "bootstrap/dist/css/bootstrap.min.css";

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
export function TextNeuronActivations({
  tokens,
  activations,
  firstDimensionName = "Layer",
  secondDimensionName = "Neuron"
}: TextNeuronActivationsProps) {
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  // We start with an empty list of samples.
  const [itemOffset, setItemOffset] = useState<number>(0);

  const endOffset: number = itemOffset + itemsPerPage;

  const activationsTensors = activations.map((sampleActivations) => {
    return tensor<Rank.R3>(sampleActivations);
  });
  // Get number of layers/neurons (Assumes all samples have the same number of layers/neurons)
  const numberOfLayers = activationsTensors[0].shape[1];
  const numberOfNeurons = activationsTensors[0].shape[2];

  // Get the relevant activations for the specific layer and neuron
  const currentActivations: number[][] = activationsTensors.map(
    (sampleActivations) => {
      return getSelectedActivations(
        sampleActivations,
        layerNumber,
        neuronNumber
      );
    }
  );

  const visibleActivations: number[][] = currentActivations.slice(
    itemOffset,
    endOffset
  );
  const visibleTokens: string[][] = tokens.slice(itemOffset, endOffset);
  const pageCount: number = Math.ceil(currentActivations.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset =
      (event.selected * itemsPerPage) % currentActivations.length;
    setItemOffset(newOffset);
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
      <Row>
        <Col>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </Col>
        <Col>
          <label htmlFor="items-per-page-selector" style={{ marginRight: 15 }}>
            Items per page:
          </label>
          <NumberSelector
            id="items-per-page-selector"
            smallestNumber={1}
            largestNumber={currentActivations.length}
            currentValue={itemsPerPage}
            setCurrentValue={setItemsPerPage}
          />
        </Col>
      </Row>
      <Items
        visibleActivations={visibleActivations}
        visibleTokens={visibleTokens}
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
