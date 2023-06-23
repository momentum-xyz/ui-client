import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundVolume, {SoundVolumePropsInterface} from './SoundVolume';

export default {
  title: 'Molecules/SoundVolume',
  component: SoundVolume,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundVolume>;

const Template: Story<SoundVolumePropsInterface> = (args) => {
  const [value, setValue] = useState(30);
  return <SoundVolume {...args} volumePercent={value} onChangeVolume={setValue} />;
};

export const General = Template.bind({});
General.args = {};
