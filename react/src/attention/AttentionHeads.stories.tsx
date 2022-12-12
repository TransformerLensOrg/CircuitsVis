import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { AttentionHeads } from "./AttentionHeads";
import { mockAttention, mockTokens } from "./mocks/attention";

export default {
  component: AttentionHeads,
  argTypes: {
    negativeColor: { control: "color" },
    positiveColor: { control: "color" },
  }
} as ComponentMeta<typeof AttentionHeads>;

const Template: ComponentStory<typeof AttentionHeads> = (args) => (
  <AttentionHeads {...args} />
);

export const InductionHeadsLayer: ComponentStory<typeof AttentionHeads> =
  Template.bind({});
InductionHeadsLayer.args = {
  tokens: mockTokens,
  attention: mockAttention
};
