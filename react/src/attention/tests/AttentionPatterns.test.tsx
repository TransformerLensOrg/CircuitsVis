import { setBackend, ones, Rank } from "@tensorflow/tfjs";
import { render, screen } from "@testing-library/react";
import React from "react";
import { AttentionPatterns, colorAttentionTensors } from "../AttentionPatterns";

beforeAll(() => {
  // Use the node backend whilst testing
  setBackend("cpu");
});

// Input with 2 tokens, 2 heads
const mockAttention = [
  [
    [1, 0],
    [0.5, 0.5]
  ],
  [
    [1, 0],
    [0.5, 0.5]
  ]
];

describe("colorAttentionTensors", () => {
  it("creates a tensor of the correct shape", () => {
    const res = colorAttentionTensors(mockAttention);
    expect(res.shape).toEqual([2, 2, 2, 3]);
  });

  it("creates colors for heads matching the snapshot", () => {
    const res = colorAttentionTensors(mockAttention);
    expect(res.arraySync()).toMatchSnapshot();
  });
});

describe("AttentionPatterns", () => {
  it("renders", () => {
    const tokens = ["A", "B", "C", "D"];
    const attention = ones<Rank.R3>([4, 4, 16]);

    render(
      <AttentionPatterns tokens={tokens} attention={attention.arraySync()} />
    );

    // Check the header text loads
    screen.getByText("Attention Patterns");
  });
});
