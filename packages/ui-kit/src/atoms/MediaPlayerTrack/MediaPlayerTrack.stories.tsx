import {ComponentMeta, Story} from '@storybook/react';

import MediaPlayerTrack, {MediaPlayerTrackInterface} from './MediaPlayerTrack';

export default {
  title: 'Molecules/MediaPlayerTrack',
  component: MediaPlayerTrack,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof MediaPlayerTrack>;

const Template: Story<MediaPlayerTrackInterface> = (args) => {
  return <MediaPlayerTrack {...args} />;
};

export const General = Template.bind({});
General.args = {
  playedPercent: 30
};
