import { ComponentMeta, ComponentStory } from "@storybook/react";
import ModalContainer, { IActionsModal } from "./ModalContainer";

export default {
  component: ModalContainer,
} as ComponentMeta<typeof ModalContainer>;


const defaultArgs: IActionsModal = {
  isOpen: true,
  setIsOpen: () => alert("clicked"),
  title: "Confirm",
  handleAction: () => alert("action executed"),
  action: "Confirm",
  children: <p>This is a confirm modal</p>,
};

const Template: ComponentStory<typeof ModalContainer> = (args: IActionsModal) => (
  <ModalContainer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

export const WithCustomButtonColor = Template.bind({});
WithCustomButtonColor.args = {
  ...defaultArgs,
  action: "Valid",
  title: "Valid",
  children: <p>This is a valid modal</p>,
};

