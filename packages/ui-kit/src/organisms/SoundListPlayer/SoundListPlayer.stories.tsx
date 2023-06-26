import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundListPlayer, {SoundListPlayerPropsInterface} from './SoundListPlayer';

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

export const General = Template.bind({});
General.args = {};
