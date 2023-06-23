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
  variant: 'primary',
  size: 'normal'
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  variant: 'primary',
  size: 'normal',
  disabled: true
};

export const IsLabel = Template.bind({});
IsLabel.args = {
  variant: 'primary',
  size: 'normal',
  isLabel: true
};

export const Small = Template.bind({});
Small.args = {
  variant: 'primary',
  size: 'small'
};

export const Normal = Template.bind({});
Normal.args = {
  variant: 'primary',
  size: 'normal'
};

export const Large = Template.bind({});
Large.args = {
  variant: 'primary',
  size: 'large'
};

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
  variant: 'primary',
  size: 'extra-large'
};
