import React from "react";
import { Row, Col } from "react-grid-system";
import { ColoredTokens } from "../tokens/ColoredTokens";

/**
 * Show the lists of tokens, colored by their activation value.
 * Each sample is displayed in a separate box, unless there is only one sample.
 *
 * @returns A div element
 */
export function SampleItems({
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
