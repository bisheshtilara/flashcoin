import { ComponentMeta, ComponentStory } from "@storybook/react";
import ActionButton from "./ActionButton";

export default {
  component: ActionButton,
} as ComponentMeta<typeof ActionButton>;


const defaultArgs: {
  remove?: boolean;
  details?: boolean;
  action?: () => void;
} = {
  remove: true,
  details: false,
  action: () => {},
};

const Template: ComponentStory<typeof ActionButton> = (args: {
  remove?: boolean;
  details?: boolean;
  action?: () => void;
}) => (
  <ActionButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};
