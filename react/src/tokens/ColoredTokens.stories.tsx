import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockValues, mockTokens } from "./mocks/coloredTokens";
import { ColoredTokens } from "./ColoredTokens";

export default {
  title: "ColoredTokens",
  component: ColoredTokens
} as ComponentMeta<typeof ColoredTokens>;

const Template: ComponentStory<typeof ColoredTokens> = (args) => (
  <ColoredTokens {...args} />
);

export const RandomActivations = Template.bind({});
RandomActivations.args = {
  tokens: mockTokens,
  values: mockValues,
  minValue: 0,
  maxValue: 1,
  minColor: "white",
  maxColor: "red"
};
