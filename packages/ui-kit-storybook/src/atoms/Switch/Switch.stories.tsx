import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Switch, {SwitchPropsInterface} from './Switch';

export default {
  title: 'Atoms/Switch',
  component: Switch
} as ComponentMeta<typeof Switch>;

const Template: Story<SwitchPropsInterface> = (args) => {
  const [value, setValue] = useState<boolean>();
  return <Switch value={value} {...args} onChange={setValue} />;
};

export const General = Template.bind({});
General.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  value: true,
  disabled: true
};
