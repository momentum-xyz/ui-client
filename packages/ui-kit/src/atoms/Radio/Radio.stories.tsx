import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Radio, {RadioPropsInterface, RadioOptionInterface} from './Radio';

export default {
  title: 'Atoms/Radio',
  component: Radio
} as ComponentMeta<typeof Radio>;

const OPTIONS: RadioOptionInterface[] = [
  {value: '0', label: 'Odyssey'},
  {value: '1', label: 'Momentum'},
  {value: '2', label: 'Kusama verse'}
];

const OPTIONS_WITH_DISABLES: RadioOptionInterface[] = [
  ...OPTIONS,
  {value: '3', label: 'Rabbit verse', disabled: true},
  {value: '4', label: 'Fox verse', disabled: true},
  {value: '5', label: 'Another verse', disabled: true}
];

const Template: Story<RadioPropsInterface> = (args) => {
  const [value, setValue] = useState<string>();
  return <Radio value={value} {...args} name="radio" onChange={setValue} />;
};

export const Vertical = Template.bind({});
Vertical.args = {
  options: OPTIONS
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  options: OPTIONS,
  variant: 'horizontal'
};

export const HasDisabled = Template.bind({});
HasDisabled.args = {
  options: OPTIONS_WITH_DISABLES
};
