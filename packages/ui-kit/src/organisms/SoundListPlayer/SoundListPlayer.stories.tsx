import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundListPlayer, {SoundListPlayerPropsInterface} from './SoundListPlayer';

const TRACK_LIST = [
  {
    name: "0.1 Let's start",
    hash: 'd3d77030f7ea894f16ac63ec468c7dfa',
    url: 'https://dev.odyssey.ninja/api/v3/render/track/d3d77030f7ea894f16ac63ec468c7dfa'
  },
  {
    name: '02. Children Of The Night World',
    hash: 'bcf7a4becfd795d99cbb658c190ca9d6',
    url: 'https://dev.odyssey.ninja/api/v3/render/track/bcf7a4becfd795d99cbb658c190ca9d6'
  },
  {
    name: '03. Look At The Moon',
    hash: 'cd224aba7252271955bcd9ff061123c8',
    url: 'https://dev.odyssey.ninja/api/v3/render/track/cd224aba7252271955bcd9ff061123c8'
  }
];

export default {
  title: 'Organisms/SoundListPlayer',
  component: SoundListPlayer,
  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundListPlayer>;

const Template: Story<SoundListPlayerPropsInterface> = (args) => {
  const [volume, setVolume] = useState(30);
  return <SoundListPlayer {...args} volumePercent={volume} onChangeVolume={setVolume} />;
};

export const NoTracks = Template.bind({});
NoTracks.args = {
  tracks: []
};

export const WithTracks = Template.bind({});
WithTracks.args = {
  tracks: TRACK_LIST
};
