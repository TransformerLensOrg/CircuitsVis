import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import {
  mockPrompt,
  mockTopKLogProbs,
  mockTopKTokens,
  mockCorrectTokenRank,
  mockCorrectTokenLogProb
} from "./mocks/mockTokenLogProbs";
import { TokenLogProbs } from "./TokenLogProbs";

export default {
  component: TokenLogProbs
} as ComponentMeta<typeof TokenLogProbs>;

const Template: ComponentStory<typeof TokenLogProbs> = (args) => (
  <TokenLogProbs {...args} />
);

export const SmallModelExample = Template.bind({});

SmallModelExample.args = {
  prompt: mockPrompt,
  topKLogProbs: mockTopKLogProbs,
  topKTokens: mockTopKTokens,
  correctTokenRank: mockCorrectTokenRank,
  correctTokenLogProb: mockCorrectTokenLogProb
};
