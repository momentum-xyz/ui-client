import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundPlayerTrack, {SoundPlayerTrackPropsInterface} from './SoundPlayerTrack';

export default {
  title: 'Atoms/SoundPlayerTrack',
  component: SoundPlayerTrack,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundPlayerTrack>;

const Template: Story<SoundPlayerTrackPropsInterface> = (args) => {
  const [value, setValue] = useState(30);

  return <SoundPlayerTrack {...args} percent={value} onChange={setValue} />;
};

export const General = Template.bind({});
General.args = {};
