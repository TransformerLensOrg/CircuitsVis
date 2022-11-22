import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockValues, mockTokens } from "./mocks/coloredTokens";
import { ColoredTokens } from "./ColoredTokens";

export default {
  title: "ColoredTokens",
  component: ColoredTokens,
  argTypes: {
    negativeColor: { control: "color" },
    positiveColor: { control: "color" },
    tokens: { control: { type: "object", raw: true } },
    values: { control: { type: "object", raw: true } }
  }
} as ComponentMeta<typeof ColoredTokens>;

const Template: ComponentStory<typeof ColoredTokens> = (args) => (
  <ColoredTokens {...args} />
);

export const CodeExample = Template.bind({});
CodeExample.args = {
  maxValue: 1,
  minValue: -1,
  tokens: mockTokens,
  values: mockValues
};
