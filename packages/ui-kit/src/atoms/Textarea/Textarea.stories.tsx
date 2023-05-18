import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Textarea, {TextareaPropsInterface} from './Textarea';

export default {
  title: 'Atoms/Textarea',
  component: Textarea,
  decorators: [
    (Story) => (
      <div className="storybook-block-2">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Textarea>;

const Template: Story<TextareaPropsInterface> = (args) => {
  const [value, setValue] = useState<string>();
  return <Textarea {...args} value={value} onChange={setValue} />;
};

export const Normal = Template.bind({});
Normal.args = {
  size: 'normal',
  placeholder: 'Enter text...'
};

export const Danger = Template.bind({});
Danger.args = {
  placeholder: 'Enter text...',
  danger: true
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Enter text...',
  disabled: true
};
