import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import TextInput, { ITextInputProps } from "./TextInput";

export default {
  component: TextInput,
} as ComponentMeta<typeof TextInput>;


const defaultArgs: ITextInputProps = {
  label: "Label",
  type: "text",
  value: "",
};

const Template: ComponentStory<typeof TextInput> = (args: ITextInputProps) => (
  <TextInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...defaultArgs,
  icon: <MagnifyingGlassIcon className="h-6 text-red-500" />,
};

