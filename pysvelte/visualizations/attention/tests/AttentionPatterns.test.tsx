import { setBackend } from "@tensorflow/tfjs-node";
import { colorAttentionTensors } from "../AttentionPatterns";

beforeAll(() => {
  // Use the node backend whilst testing
  setBackend("cpu");
});

describe("colorAttentionTensors", () => {
  it("creates a tensor of the correct shape", () => {
    // Input with 2 tokens, 2 heads
    const input = [
      [
        [1, 0],
        [0.5, 0.5],
      ],
      [
        [1, 0],
        [0.5, 0.5],
      ],
    ];

    const res = colorAttentionTensors(input);
    expect(res.shape).toEqual([2, 2, 2, 3]);
  });
});
