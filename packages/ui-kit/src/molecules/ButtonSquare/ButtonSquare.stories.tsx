import {ComponentMeta, Story} from '@storybook/react';

import ButtonSquare, {ButtonSquarePropsInterface} from './ButtonSquare';

export default {
  title: 'Molecules/ButtonSquare',
  component: ButtonSquare
} as ComponentMeta<typeof ButtonSquare>;

const Template: Story<ButtonSquarePropsInterface> = (args) => {
  return <ButtonSquare {...args} />;
};

export const General = Template.bind({});
General.args = {
  icon: 'ai',
  label: 'Create an AI image'
};

export const Active = Template.bind({});
Active.args = {
  icon: 'ai',
  label: 'Create an AI image',
  isActive: true
};

export const Disabled = Template.bind({});
Disabled.args = {
  icon: 'ai',
  label: 'Create an AI image',
  isDisabled: true
};
