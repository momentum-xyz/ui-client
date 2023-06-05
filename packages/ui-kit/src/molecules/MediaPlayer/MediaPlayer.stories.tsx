import {ComponentMeta, Story} from '@storybook/react';

import MediaPlayer, {MediaPlayerInterface} from './MediaPlayer';

export default {
  title: 'Molecules/MediaPlayer',
  component: MediaPlayer,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof MediaPlayer>;

const Template: Story<MediaPlayerInterface> = (args) => {
  return <MediaPlayer {...args} />;
};

export const General = Template.bind({});
General.args = {
  sourceUrl: 'blob:http://localhost:3000/41812aed-9d85-45e9-87e4-94619d3832f7'
};
