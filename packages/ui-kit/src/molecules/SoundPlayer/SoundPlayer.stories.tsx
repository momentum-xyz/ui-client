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
  return <SoundPlayer {...args} />;
};

export const NoAudio = Template.bind({});
NoAudio.args = {
  state: {
    isPlaying: false,
    isStopped: true,
    durationSec: 0,
    playedSec: 0,
    playedPercent: 0
  }
};

export const WithAudio = Template.bind({});
WithAudio.args = {
  state: {
    isPlaying: false,
    isStopped: false,
    durationSec: 78,
    playedSec: 12,
    playedPercent: 10
  },
  onChangePlayed: () => {}
};
