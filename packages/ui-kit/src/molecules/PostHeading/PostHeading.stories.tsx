import {ComponentMeta, Story} from '@storybook/react';
import {TimelineTypeEnum} from '@momentum-xyz/core';

import PostHeading, {PostHeadingPropsInterface} from './PostHeading';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/PostHeading',
  component: PostHeading,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostHeading>;

const Template: Story<PostHeadingPropsInterface> = (args) => {
  return <PostHeading {...args} />;
};

export const General = Template.bind({});
General.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: true
  },
  entry: undefined
};

export const WithInfo = Template.bind({});
WithInfo.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: false
  },
  entry: {
    id: '1',
    hashSrc: IMAGE_SRC,
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
    type: TimelineTypeEnum.SCREENSHOT,
    created: '2023-06-09T11:07:25.064Z',
    objectId: '1',
    objectName: 'Odyssey #1'
  }
};

export const WithInfoWithoutWorld = Template.bind({});
WithInfoWithoutWorld.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: false
  },
  entry: {
    id: '1',
    hashSrc: IMAGE_SRC,
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
    type: TimelineTypeEnum.SCREENSHOT,
    created: '2023-06-09T11:07:25.064Z'
  }
};
