import {ComponentMeta, Story} from '@storybook/react';

import Button, {ButtonPropsInterface} from './Button';

export default {
  title: 'Atoms/Button',
  component: Button
} as ComponentMeta<typeof Button>;

const Template: Story<ButtonPropsInterface> = (args) => {
  return <Button {...args} label="Start your journey" />;
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary'
};

export const PrimaryWithIcon = Template.bind({});
PrimaryWithIcon.args = {
  icon: 'astro',
  variant: 'primary'
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  icon: 'astro',
  variant: 'primary',
  disabled: true
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary'
};

export const SecondaryWithIcon = Template.bind({});
SecondaryWithIcon.args = {
  icon: 'astro',
  variant: 'secondary'
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  icon: 'astro',
  variant: 'secondary',
  disabled: true
};

export const Third = Template.bind({});
Third.args = {
  variant: 'third'
};

export const ThirdWithIcon = Template.bind({});
ThirdWithIcon.args = {
  icon: 'astro',
  variant: 'third'
};

export const ThirdDisabled = Template.bind({});
ThirdDisabled.args = {
  icon: 'astro',
  variant: 'third',
  disabled: true
};

export const Wide = Template.bind({});
Wide.args = {
  icon: 'astro',
  variant: 'primary',
  wide: true
};
