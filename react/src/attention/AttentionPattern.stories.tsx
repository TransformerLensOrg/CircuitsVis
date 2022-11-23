import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { AttentionPattern } from "./AttentionPattern";
import { mockAttention, mockTokens } from "./mocks/attention";

export default {
  component: AttentionPattern,
  argTypes: {
    negativeColor: { control: "color" },
    positiveColor: { control: "color" },
    tokens: { control: { type: "object", raw: true } },
    values: { control: { type: "object", raw: true } }
  }
} as ComponentMeta<typeof AttentionPattern>;

const Template: ComponentStory<typeof AttentionPattern> = (args) => (
  <AttentionPattern {...args} />
);

export const InductionHead: ComponentStory<typeof AttentionPattern> =
  Template.bind({});
InductionHead.args = {
  tokens: mockTokens,
  attention: mockAttention[0]
};
