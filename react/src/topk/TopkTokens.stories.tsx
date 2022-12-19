import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import {
  mockTokens,
  topkVals,
  topkIdxs,
  bottomkVals,
  bottomkIdxs,
  objType
} from "./mocks/topkTokens";
import { TopkTokens } from "./TopkTokens";

export default {
  component: TopkTokens
} as ComponentMeta<typeof TopkTokens>;

const Template: ComponentStory<typeof TopkTokens> = (args) => (
  <TopkTokens {...args} />
);

export const SmallModelExample = Template.bind({});
SmallModelExample.args = {
  tokens: mockTokens,
  topkVals,
  topkIdxs,
  bottomkVals,
  bottomkIdxs,
  thirdDimensionName: objType
};
