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
  imageSrc: IMAGE_SRC
};

export const NoCall = Template.bind({});
NoCall.args = {
  username: 'Username',
  imageSrc: IMAGE_SRC,
  isCallHidden: true
};
