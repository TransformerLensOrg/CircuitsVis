import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockActivations, mockTokens } from "./mocks/textNeuronActivations";
import { TextNeuronActivations } from "./TextNeuronActivations";

export default {
  component: TextNeuronActivations
} as ComponentMeta<typeof TextNeuronActivations>;

const Template: ComponentStory<typeof TextNeuronActivations> = (args) => (
  <TextNeuronActivations {...args} />
);

export const MultipleSamples = Template.bind({});
MultipleSamples.args = {
  tokens: mockTokens,
  activations: mockActivations
};

export const SingleSample = Template.bind({});
SingleSample.args = {
  tokens: mockTokens[0],
  activations: mockActivations[0]
};
