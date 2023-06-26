import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundItem, {SoundItemPropsInterface} from './SoundItem';

const TRACK_ITEM = {
  name: "0.1 Let's start",
  hash: 'd3d77030f7ea894f16ac63ec468c7dfa',
  url: 'https://dev.odyssey.ninja/api/v3/render/track/d3d77030f7ea894f16ac63ec468c7dfa'
};

export default {
  title: 'Molecules/SoundItem',
  component: SoundItem,
  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundItem>;

const Template: Story<SoundItemPropsInterface> = (args) => {
  const [isActive, setIsActive] = useState(false);
  return <SoundItem {...args} isActive={isActive} onPlayPause={() => setIsActive(!isActive)} />;
};

export const General = Template.bind({});
General.args = {
  item: TRACK_ITEM
};
