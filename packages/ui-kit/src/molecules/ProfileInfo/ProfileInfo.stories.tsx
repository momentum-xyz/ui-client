import {ComponentMeta, Story} from '@storybook/react';

import ProfileInfo, {ProfileInfoPropsInterface} from './ProfileInfo';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/ProfileInfo',
  component: ProfileInfo,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof ProfileInfo>;

const Template: Story<ProfileInfoPropsInterface> = (args) => {
  return <ProfileInfo {...args} />;
};

export const General = Template.bind({});
General.args = {
  username: 'Username',
  location: 'Current location',
  imageSrc: IMAGE_SRC
};

export const NoLocation = Template.bind({});
NoLocation.args = {
  username: 'Username',
  imageSrc: IMAGE_SRC
};

export const NoCall = Template.bind({});
NoCall.args = {
  username: 'Username',
  imageSrc: IMAGE_SRC,
  location: 'Current location',
  isCallHidden: true
};
