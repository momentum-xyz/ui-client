import {ComponentMeta, Story} from '@storybook/react';

import ButtonEllipse, {ButtonEllipsePropsInterface} from './ButtonEllipse';

export default {
  title: 'Atoms/ButtonEllipse',
  component: ButtonEllipse
} as ComponentMeta<typeof ButtonEllipse>;

const Template: Story<ButtonEllipsePropsInterface> = (args) => {
  return <ButtonEllipse {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  icon: 'close_large',
  label: 'Close'
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  icon: 'close_large',
  label: 'Close'
};

export const Thirty = Template.bind({});
Thirty.args = {
  variant: 'thirty',
  icon: 'close_large',
  label: 'Close'
};

export const IsActive = Template.bind({});
IsActive.args = {
  variant: 'primary',
  icon: 'close_large',
  label: 'Close',
  isActive: true
};

export const IsLabel = Template.bind({});
IsLabel.args = {
  variant: 'primary',
  icon: 'calendar',
  label: 'Calendar',
  isLabel: true
};

export const OnlyLabel = Template.bind({});
OnlyLabel.args = {
  variant: 'primary',
  label: 'Close'
};

export const OnlyIcon = Template.bind({});
OnlyIcon.args = {
  variant: 'primary',
  icon: 'favorite'
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  variant: 'primary',
  icon: 'close_large',
  label: 'Close',
  disabled: true
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  variant: 'secondary',
  icon: 'close_large',
  label: 'Close',
  disabled: true
};

export const ThirtyDisabled = Template.bind({});
ThirtyDisabled.args = {
  variant: 'thirty',
  icon: 'close_large',
  label: 'Close',
  disabled: true
};
