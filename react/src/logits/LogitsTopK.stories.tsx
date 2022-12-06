import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockValues, mockTokens } from "./mocks/coloredTokens";
import { LogitsTopK } from "./LogitsTopK";

export default {
  component: LogitsTopK,
  argTypes: {
    negativeColor: { control: "color" },
    positiveColor: { control: "color" },
    tokens: { control: { type: "object", raw: true } },
    values: { control: { type: "object", raw: true } }
  }
} as ComponentMeta<typeof LogitsTopK>;

const Template: ComponentStory<typeof LogitsTopK> = (args) => (
  <LogitsTopK {...args} />
);

export const CodeExample = Template.bind({});
CodeExample.args = {
  tokens: mockTokens,
  values: mockValues
};
