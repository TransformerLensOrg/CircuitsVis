const tf = require("@tensorflow/tfjs");
const readline = require("readline");

const React = require("react");
const { Container, Row, Col } = require("react-grid-system");
// const col = require("./logits/LogProbVis")
// const ColoredTokens = require("./tokens/ColoredTokens").ColoredTokens;
// const TokenCustomTooltip = require("./tokens/utils/TokenCustomTooltip").TokenCustomTooltip;
// const Token = require("./tokens/utils/Token").Token;
// const formatTokenText = require("./tokens/utils/Token").formatTokenText;

const colord = require("colord");
// const extend = require("colord/lib/extend");
// const AnyColor = require("colord/lib/types/AnyColor");
const { Colord } = colord;
const mixPlugin = require("colord/plugins/mix");
const namesPlugin = require("colord/plugins/names");

colord.extend([mixPlugin, namesPlugin]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Welcome to the TensorFlow.js REPL!");
console.log(
  "Enter a TensorFlow.js expression or statement and press enter to evaluate it."
);

show = (x) => console.log(x.arraySync());

rl.on("line", (input) => {
  try {
    // Evaluate the input and print the result
    const result = eval(input);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});
