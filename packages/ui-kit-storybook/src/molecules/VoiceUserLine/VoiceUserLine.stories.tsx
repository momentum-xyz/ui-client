import {ComponentMeta, Story} from '@storybook/react';

import VoiceUserLine, {VoiceUserLinePropsInterface} from './VoiceUserLine';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/VoiceUserLine',
  component: VoiceUserLine,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof VoiceUserLine>;

const Template: Story<VoiceUserLinePropsInterface> = (args) => {
  return <VoiceUserLine {...args} />;
};

export const General = Template.bind({});
General.args = {
  username: 'Username',
  imageSrc: IMAGE_SRC,
  isMicrophoneOff: false
};

export const IsSpeaking = Template.bind({});
IsSpeaking.args = {
  username: 'Username',
  imageSrc: IMAGE_SRC,
  isSpeaking: true
};

export const IsMuted = Template.bind({});
IsMuted.args = {
  username: 'Username',
  imageSrc: IMAGE_SRC,
  isMicrophoneOff: true
};
