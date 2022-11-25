import ReactPaginate from "react-paginate";
import { Rank, tensor, Tensor1D, Tensor3D } from "@tensorflow/tfjs";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-grid-system";
import { ColoredTokens } from "../tokens/ColoredTokens";
import "bootstrap/dist/css/bootstrap.min.css";

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
  secondDimensionName = "Neuron",
  itemsPerPage = 10
}: TextNeuronActivationsProps) {
  const [layerNumber, setLayerNumber] = useState<number>(0);
  const [neuronNumber, setNeuronNumber] = useState<number>(0);

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

  // We start with an empty list of samples.
  const [visibleActivations, setVisibleActivations] = useState<
    number[][] | null
  >(null);
  const [visibleTokens, setVisibleTokens] = useState<string[][] | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState<number>(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setVisibleActivations(currentActivations.slice(itemOffset, endOffset));
    setVisibleTokens(tokens.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(currentActivations.length / itemsPerPage));
  }, [currentActivations, itemOffset, itemsPerPage, tokens]);

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

  /**
   *
   * Number of items to show per page
   *
   */
  itemsPerPage?: number;
}
