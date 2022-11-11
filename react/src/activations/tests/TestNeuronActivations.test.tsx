import { tensor } from "@tensorflow/tfjs-node";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  getSelectedActivations,
  TextNeuronActivations
} from "../TextNeuronActivations";
import { mockActivations, mockTokens } from "../mocks/textNeuronActivations";

describe("getSelectedActivations", () => {
  it("gets the correct activation for a specified layer and neuron", () => {
    const activations: number[][][] = [
      // Token 0
      [
        // Layer 0
        [
          0, // Neuron 0
          1 // Neuron 1
        ],
        // Layer 1
        [
          10, // Neuron 0
          20 // Neuron 1
        ]
      ]
    ];

    const res = getSelectedActivations(tensor(activations), 1, 1);

    expect(res).toEqual([20]);
  });
});

describe("TextNeuronActivations", () => {
  it("renders", () => {
    render(
      <TextNeuronActivations
        tokens={mockTokens}
        activations={mockActivations}
      />
    );

    // Check it renders
    screen.getByText("Layer:");
  });
});
