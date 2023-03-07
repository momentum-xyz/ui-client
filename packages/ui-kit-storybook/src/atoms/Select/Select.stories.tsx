import {ComponentMeta, Story} from '@storybook/react';

import Select, {SelectPropsInterface, SelectOptionInterface} from './Select';

export default {
  title: 'Atoms/Select',
  component: Select
} as ComponentMeta<typeof Select>;

const Template: Story<SelectPropsInterface> = (args) => {
  const options: SelectOptionInterface[] = [
    {value: 'ocean', label: 'Ocean'},
    {value: 'blue', label: 'Blue'},
    {value: 'purple', label: 'Purple'},
    {value: 'red', label: 'Red'},
    {value: 'orange', label: 'Orange'}
  ];
  return <Select {...args} options={options} />;
};

export const SingleValue = Template.bind({});
SingleValue.args = {};

export const MultiValue = Template.bind({});
MultiValue.args = {
  isMulti: true
};
