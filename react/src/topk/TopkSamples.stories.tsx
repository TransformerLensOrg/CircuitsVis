import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockActivations, mockTokens } from "./mocks/topkSamples";
import { TopkSamples } from "./TopkSamples";

export default {
  component: TopkSamples
} as ComponentMeta<typeof TopkSamples>;

const Template: ComponentStory<typeof TopkSamples> = (args) => (
  <TopkSamples {...args} />
);

export const ExampleSamples: ComponentStory<typeof TopkSamples> = Template.bind(
  {}
);
ExampleSamples.args = {
  tokens: mockTokens,
  activations: mockActivations
};
