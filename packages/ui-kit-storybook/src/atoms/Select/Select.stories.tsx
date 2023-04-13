import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Select, {SelectPropsInterface, SelectOptionInterface} from './Select';

export default {
  title: 'Atoms/Select',
  component: Select,
  argTypes: {
    isMulti: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    }
  }
} as ComponentMeta<typeof Select>;

const OPTIONS: SelectOptionInterface[] = [
  {value: 'ocean', label: 'Ocean'},
  {value: 'blue', label: 'Blue'},
  {value: 'purple', label: 'Purple'},
  {value: 'red', label: 'Red'},
  {value: 'orange', label: 'Orange'}
];

const TemplateSingle: Story<SelectPropsInterface> = (args) => {
  const [value, setValue] = useState<string | null>(null);
  return <Select {...args} value={value} onSingleChange={setValue} />;
};

const TemplateMulti: Story<SelectPropsInterface> = (args) => {
  const [value, setValue] = useState<string[]>([]);
  return <Select {...args} isMulti value={value} onMultiChange={setValue} />;
};

export const Single = TemplateSingle.bind({});
Single.args = {
  placeholder: 'Choose wallet',
  options: OPTIONS
};

export const Multi = TemplateMulti.bind({});
Multi.args = {
  placeholder: 'Choose wallets',
  multiSuffix: 'selected',
  options: OPTIONS
};

export const MultiOpened = TemplateMulti.bind({});
MultiOpened.args = {
  placeholder: 'Choose wallets',
  multiSuffix: 'selected',
  closeMenuOnSelect: false,
  options: OPTIONS
};

export const Searchable = TemplateSingle.bind({});
Searchable.args = {
  placeholder: 'Choose wallet',
  options: OPTIONS,
  isSearchable: true
};

export const HideSelected = TemplateSingle.bind({});
HideSelected.args = {
  placeholder: 'Choose wallet',
  options: OPTIONS,
  hideSelectedOptions: true
};

export const NoOptions = TemplateSingle.bind({});
NoOptions.args = {
  placeholder: 'Choose wallet',
  options: []
};

export const Disabled = TemplateSingle.bind({});
Disabled.args = {
  placeholder: 'Choose wallet',
  options: OPTIONS,
  isDisabled: true
};

export const NoSpaceOnBottom = TemplateSingle.bind({});
NoSpaceOnBottom.args = {
  placeholder: 'Choose wallet',
  options: OPTIONS
};
NoSpaceOnBottom.decorators = [
  () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div
        style={{
          height: 'calc(100vh + 400px)',
          paddingBottom: '500px',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        <Select {...(NoSpaceOnBottom.args as any)} isMulti value={value} onMultiChange={setValue} />
      </div>
    );
  }
];
