import {ComponentMeta, Story} from '@storybook/react';

import MediaPlayerTime, {MediaPlayerTimeInterface} from './MediaPlayerTime';

export default {
  title: 'Atoms/MediaPlayerTime',
  component: MediaPlayerTime,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof MediaPlayerTime>;

const Template: Story<MediaPlayerTimeInterface> = (args) => {
  return <MediaPlayerTime {...args} />;
};

export const General = Template.bind({});
General.args = {
  playedSeconds: 0,
  duration: 15,
  children: <div />
};
