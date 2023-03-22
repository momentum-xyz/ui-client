import {ComponentMeta, Story} from '@storybook/react';

import ButtonRound, {ButtonRoundPropsInterface} from './ButtonRound';

export default {
  title: 'Atoms/ButtonRound',
  component: ButtonRound
} as ComponentMeta<typeof ButtonRound>;

const Template: Story<ButtonRoundPropsInterface> = (args) => {
  return <ButtonRound {...args} icon="astro" />;
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary'
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  variant: 'primary',
  disabled: true
};

export const IsLabel = Template.bind({});
IsLabel.args = {
  variant: 'primary',
  isLabel: true
};
