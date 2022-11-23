import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockValues, mockTokens } from "./mocks/coloredTokens";
import { ColoredTokens } from "./ColoredTokens";

export default {
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
  tokens: mockTokens,
  values: mockValues
};
