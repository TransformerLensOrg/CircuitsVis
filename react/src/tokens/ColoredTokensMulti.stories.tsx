import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockTokens, mockValues, mockLabels } from "./mocks/coloredTokensMulti";
import { ColoredTokensMulti } from "./ColoredTokensMulti";

export default {
  component: ColoredTokensMulti
} as ComponentMeta<typeof ColoredTokensMulti>;

const Template: ComponentStory<typeof ColoredTokensMulti> = (args) => (
  <ColoredTokensMulti {...args} />
);

export const SmallModelExample = Template.bind({});
SmallModelExample.args = {
  tokens: mockTokens,
  values: mockValues,
  labels: mockLabels
};
