import { ComponentMeta, ComponentStory } from "@storybook/react";
import ActionsListModal, { IActionsListModalProps } from "./ActionsListModal";

export default {
  component: ActionsListModal,
} as ComponentMeta<typeof ActionsListModal>;


const defaultArgs: IActionsListModalProps = {
  isOpen: true,
  setIsOpen: () => alert("clicked"),
  title: "Delete",
  handleAction: () => alert("action executed"),
};

const Template: ComponentStory<typeof ActionsListModal> = (args: IActionsListModalProps) => (
  <ActionsListModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

