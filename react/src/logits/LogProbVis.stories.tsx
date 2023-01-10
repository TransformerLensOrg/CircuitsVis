import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import {
  mockPrompt,
  mockTopKLogProbs,
  mockTopKTokens,
  mockCorrectTokenRank,
  mockCorrectTokenLogProb
} from "./mocks/logProbVis";
import { LogProbVis } from "./LogProbVis";

export default {
  component: LogProbVis
} as ComponentMeta<typeof LogProbVis>;

const Template: ComponentStory<typeof LogProbVis> = (args) => (
  <LogProbVis {...args} />
);

export const SmallModelExample = Template.bind({});
SmallModelExample.args = {
  prompt: mockPrompt,
  topKLogProbs: mockTopKLogProbs,
  topKTokens: mockTopKTokens,
  correctTokenRank: mockCorrectTokenRank,
  correctTokenLogProb: mockCorrectTokenLogProb
};
