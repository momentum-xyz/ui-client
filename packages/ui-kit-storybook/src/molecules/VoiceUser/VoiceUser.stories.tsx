import {ComponentMeta, Story} from '@storybook/react';

import VoiceUser, {VoiceUserPropsInterface} from './VoiceUser';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/VoiceUser',
  component: VoiceUser,
  argTypes: {
    hexagon: {
      table: {
        disable: true
      }
    }
  },
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
  imageSrc: IMAGE_SRC
};

export const IsActive = Template.bind({});
IsActive.args = {
  imageSrc: IMAGE_SRC,
  isActive: true
};
