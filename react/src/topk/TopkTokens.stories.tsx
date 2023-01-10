import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import {
  mockTokens,
  topkVals,
  topkIdxs,
  bottomkVals,
  bottomkIdxs,
  objType,
  layerLabels
} from "./mocks/topkTokens";
import { TopkTokens } from "./TopkTokens";

export default {
  component: TopkTokens
} as ComponentMeta<typeof TopkTokens>;

const Template: ComponentStory<typeof TopkTokens> = (args) => (
  <TopkTokens {...args} />
);

export const ExampleTokens: ComponentStory<typeof TopkTokens> = Template.bind(
  {}
);
ExampleTokens.args = {
  tokens: mockTokens,
  topkVals,
  topkIdxs,
  bottomkVals,
  bottomkIdxs,
  thirdDimensionName: objType,
  firstDimensionLabels: layerLabels
};
