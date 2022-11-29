import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockActivations, mockTokens, k, objType } from "./mocks/topk";
import { Topk } from "./Topk";

export default {
  component: Topk
} as ComponentMeta<typeof Topk>;

const Template: ComponentStory<typeof Topk> = (args) => <Topk {...args} />;

export const SmallModelExample = Template.bind({});
SmallModelExample.args = {
  k: k,
  tokens: mockTokens,
  activations: mockActivations,
  thirdDimensionName: objType
};
