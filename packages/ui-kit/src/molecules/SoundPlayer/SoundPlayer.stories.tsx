import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundPlayer, {SoundPlayerPropsInterface} from './SoundPlayer';

export default {
  title: 'Molecules/SoundPlayer',
  component: SoundPlayer,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundPlayer>;

const Template: Story<SoundPlayerPropsInterface> = (args) => {
  const [isPlaying, setIsPlaying] = useState(false);
  return <SoundPlayer {...args} isPlaying={isPlaying} onIsPlaying={setIsPlaying} />;
};

export const NoAudio = Template.bind({});
NoAudio.args = {
  isPlaying: false,
  isStopped: true
};
