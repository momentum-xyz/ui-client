import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';
import {MediaFileInterface} from '@momentum-xyz/core';

import MusicPlayerView, {MusicPlayerViewPropsInterface} from './MusicPlayerView';

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
  title: 'Organisms/MusicPlayerView',
  component: MusicPlayerView,
  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof MusicPlayerView>;

const Template: Story<MusicPlayerViewPropsInterface> = (args) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [track, setTrack] = useState<MediaFileInterface>();
  return (
    <MusicPlayerView
      {...args}
      isPlaying={isPlaying}
      activeTrack={track}
      volumePercent={volume}
      onChangeVolume={setVolume}
      onStart={setTrack}
      onStop={() => setTrack(undefined)}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
    />
  );
};

export const NoTracks = Template.bind({});
NoTracks.args = {
  tracks: []
};

export const WithTracks = Template.bind({});
WithTracks.args = {
  tracks: TRACK_LIST,
  onDeleteTrack: (hash) => console.log('onDeleteTrack', hash)
};
