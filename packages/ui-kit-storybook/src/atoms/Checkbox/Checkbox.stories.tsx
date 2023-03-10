import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Checkbox, {CheckboxPropsInterface} from './Checkbox';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox
} as ComponentMeta<typeof Checkbox>;

const Template: Story<CheckboxPropsInterface> = (args) => {
  const [value, setValue] = useState<boolean>();
  return <Checkbox {...args} value={value} onChange={setValue} />;
};

export const General = Template.bind({});
General.args = {
  label: 'Lorem ipsum text'
};

export const NoLabel = Template.bind({});
NoLabel.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Lorem ipsum text',
  disabled: true
};
