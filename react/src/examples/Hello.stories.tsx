import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { Hello } from "./Hello";

export default {
  title: "Hello",
  component: Hello
} as ComponentMeta<typeof Hello>;

const Template: ComponentStory<typeof Hello> = (args) => <Hello {...args} />;

export const BobExample = Template.bind({});
BobExample.args = { name: "Bob" };
