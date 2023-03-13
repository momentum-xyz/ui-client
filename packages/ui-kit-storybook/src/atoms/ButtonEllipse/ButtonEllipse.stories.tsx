import {ComponentMeta, Story} from '@storybook/react';

import ButtonEllipse, {ButtonEllipsePropsInterface} from './ButtonEllipse';

export default {
  title: 'Atoms/ButtonEllipse',
  component: ButtonEllipse
} as ComponentMeta<typeof ButtonEllipse>;

const Template: Story<ButtonEllipsePropsInterface> = (args) => {
  return <ButtonEllipse {...args} icon="close" label="Close" />;
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
