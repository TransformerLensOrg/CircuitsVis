import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import {
  mockTokens,
  topkVals,
  topkIdxs,
  bottomkVals,
  bottomkIdxs,
  objType
} from "./mocks/topk";
import { Topk } from "./Topk";

export default {
  component: Topk
} as ComponentMeta<typeof Topk>;

const Template: ComponentStory<typeof Topk> = (args) => <Topk {...args} />;

export const SmallModelExample = Template.bind({});
SmallModelExample.args = {
  tokens: mockTokens,
  topkVals,
  topkIdxs,
  bottomkVals,
  bottomkIdxs,
  thirdDimensionName: objType
};
