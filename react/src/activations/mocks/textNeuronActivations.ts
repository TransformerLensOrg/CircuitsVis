// mockTokens is a list of lists of tokens
export const mockTokens: string[][] = [
  [
    "<EOT>",
    "Creating",
    " interp",
    "retability",
    " vis",
    "ualizations",
    " is",
    ' "',
    "fun",
    '"',
    "."
  ],
  "Mr. and Mrs. Dursley of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. Not for the first time, an argument had broken out over breakfast at number four, Privet Drive.".split(
    /(?=\s)/
  ),
  "When Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.".split(
    /(?=\s)/
  )
];

const numLayers: number = 2;
const numNeurons: number = 3;
// create a nested list of shape (2, 3) with random numbers between 0 and 1
function createRandom3DActivationMatrix(shape: number[]) {
  return Array.from(Array(shape[0]), () =>
    Array.from(Array(shape[1]), () =>
      Array.from(Array(shape[2]), () => Math.random())
    )
  );
}
export const mockActivations: number[][][][] = mockTokens.map((tokens) => {
  const { length } = tokens;
  return createRandom3DActivationMatrix([length, numLayers, numNeurons]);
});
