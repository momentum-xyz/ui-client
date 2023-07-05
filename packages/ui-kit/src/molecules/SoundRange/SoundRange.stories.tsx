import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundRange, {SoundRangePropsInterface} from './SoundRange';

export default {
  title: 'Molecules/SoundRange',
  component: SoundRange,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundRange>;

const Template: Story<SoundRangePropsInterface> = (args) => {
  const [value, setValue] = useState(30);
  return <SoundRange {...args} percent={value} onChange={setValue} />;
};

export const General = Template.bind({});
General.args = {};
