import { ComponentMeta, ComponentStory } from "@storybook/react";
import CoinListSideBarModal, { IActionsListModalProps } from "./CoinListSideBarModal";

export default {
  component: CoinListSideBarModal,
} as ComponentMeta<typeof CoinListSideBarModal>;


const defaultArgs: IActionsListModalProps = {
  isOpen: true,
  setIsOpen: () => alert("clicked"),
  title: "Confirm",
  handleAction: () => alert("action executed"),
  action: "Confirm",
  content: <p>This is a confirm modal</p>,
};

const Template: ComponentStory<typeof CoinListSideBarModal> = (args: IActionsListModalProps) => (
  <CoinListSideBarModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

