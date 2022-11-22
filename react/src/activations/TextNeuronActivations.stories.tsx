import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { mockActivations, mockTokens } from "./mocks/textNeuronActivations";
import { TextNeuronActivations } from "./TextNeuronActivations";

export default {
  title: "TextNeuronActivations",
  component: TextNeuronActivations
} as ComponentMeta<typeof TextNeuronActivations>;

const Template: ComponentStory<typeof TextNeuronActivations> = (args) => (
  <TextNeuronActivations {...args} />
);

export const SmallModelExample = Template.bind({});
SmallModelExample.args = {
  tokens: mockTokens,
  activations: mockActivations
};
