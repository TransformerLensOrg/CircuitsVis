import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { Hello } from "./Hello";

export default {
  title: "Hello",
  component: Hello
} as ComponentMeta<typeof Hello>;

const Template: ComponentStory<typeof Hello> = (args) => <Hello {...args} />;

export const Bob = Template.bind({});
Bob.args = { name: "Bob" };
