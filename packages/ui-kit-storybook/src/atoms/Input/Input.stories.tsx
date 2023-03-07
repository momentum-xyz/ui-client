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

const Template: Story<InputPropsInterface> = (args) => <Input {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  defaultValue: 'Your input',
  size: 'normal',
  placeholder: 'Enter text...',
  opts: stringInputMask
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  placeholder: 'Enter text...',
  opts: stringInputMask
};

export const Danger = Template.bind({});
Danger.args = {
  placeholder: 'Enter text...',
  danger: true,
  opts: stringInputMask
};

export const Disabled = Template.bind({});
Disabled.args = {
  defaultValue: 'Lorem ipsum',
  disabled: true,
  opts: stringInputMask
};

export const Number = Template.bind({});
Number.args = {
  placeholder: 'Enter positive number...',
  opts: numberInputMask()
};

export const NegativeNumber = Template.bind({});
NegativeNumber.args = {
  placeholder: 'Enter negative number...',
  opts: numberInputMask(0, true)
};

export const Decimal = Template.bind({});
Decimal.args = {
  placeholder: 'Enter positive decimal...',
  opts: numberInputMask(5)
};

export const DecimalWithPrefix = Template.bind({});
DecimalWithPrefix.args = {
  placeholder: 'Enter positive decimal...',
  opts: numberInputPrefixMask('$', 5)
};

export const DecimalWithSuffix = Template.bind({});
DecimalWithSuffix.args = {
  placeholder: 'Enter positive decimal...',
  opts: numberInputSuffixMask('MOM', 5)
};
