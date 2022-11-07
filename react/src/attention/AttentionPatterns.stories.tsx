import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { AttentionPatterns } from "./AttentionPatterns";
import { mockAttention, mockTokens } from "./mocks/attention";

export default {
  title: "AttentionPatterns",
  component: AttentionPatterns
} as ComponentMeta<typeof AttentionPatterns>;

const Template: ComponentStory<typeof AttentionPatterns> = (args) => (
  <AttentionPatterns {...args} />
);

export const GPT2: ComponentStory<typeof AttentionPatterns> = Template.bind({});
GPT2.args = {
  tokens: mockTokens,
  attention: mockAttention
};
