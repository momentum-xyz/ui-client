import {ComponentMeta, Story} from '@storybook/react';

import VoiceUser, {VoiceUserPropsInterface} from './VoiceUser';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/VoiceUser',
  component: VoiceUser,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof VoiceUser>;

const Template: Story<VoiceUserPropsInterface> = (args) => {
  return <VoiceUser {...args} />;
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
