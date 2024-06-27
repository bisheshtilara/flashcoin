import { ComponentMeta, ComponentStory } from "@storybook/react";
import Button, { IButtonProps } from "./Button";

export default {
  component: Button,
} as ComponentMeta<typeof Button>;

const enum ButtonType {
  button = "button",
  submit = "submit",
  reset = "reset",
}

const defaultArgs: IButtonProps = {
  onClick: () => alert("Button clicked"),
  secondary: true,
  disabled: false,
  loading: false,
  tailwindStyle:
    "bg-red-600 text-white rounded-full p-3 flex items-center justify-center gap-2 transition-all ease-in hover:-translate-y-2 cursor-pointer",
  label: "Add",
  type: ButtonType.button,
};

const Template: ComponentStory<typeof Button> = (args: IButtonProps) => (
  <Button {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};
