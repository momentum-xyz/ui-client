import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import {
  stringInputMask,
  numberInputMask,
  numberInputPrefixMask,
  numberInputSuffixMask
} from './Input.masks';
import Input, {InputPropsInterface} from './Input';

export default {
  title: 'Atoms/Input',
  component: Input
} as ComponentMeta<typeof Input>;

const Template: Story<InputPropsInterface> = (args) => {
  const [value, setValue] = useState('');
  return <Input {...args} value={value} onChange={setValue} />;
};

export const Text = Template.bind({});
Text.args = {
  size: 'normal',
  placeholder: 'Enter text...',
  opts: stringInputMask
};

export const Number = Template.bind({});
Number.args = {
  placeholder: 'Enter positive number...',
  opts: numberInputMask()
};

export const Negative = Template.bind({});
Negative.args = {
  placeholder: 'Enter negative number...',
  opts: numberInputMask(0, true)
};

export const Decimal = Template.bind({});
Decimal.args = {
  placeholder: 'Enter positive decimal...',
  opts: numberInputMask(5)
};

export const Prefix = Template.bind({});
Prefix.args = {
  placeholder: 'Enter positive decimal...',
  opts: numberInputPrefixMask('$', 5)
};

export const Suffix = Template.bind({});
Suffix.args = {
  placeholder: 'Enter positive decimal...',
  opts: numberInputSuffixMask('MOM', 5)
};

export const Danger = Template.bind({});
Danger.args = {
  placeholder: 'Enter text...',
  danger: true,
  opts: stringInputMask
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Enter text...',
  disabled: true,
  opts: stringInputMask
};

export const ListOfSizes = Template.bind({});
ListOfSizes.args = {
  placeholder: 'Enter text...',
  opts: stringInputMask
};
ListOfSizes.decorators = [
  () => {
    return (
      <div className="storybook-grid-rows">
        <Input {...(ListOfSizes.args as InputPropsInterface)} size="normal" />
        <Input {...(ListOfSizes.args as InputPropsInterface)} size="small" />
      </div>
    );
  }
];
