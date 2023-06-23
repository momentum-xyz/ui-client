import {ComponentMeta, Story} from '@storybook/react';
import {TimelineTypeEnum} from '@momentum-xyz/core';

import PostStakeView, {PostStakeViewPropsInterface} from './PostStakeView';

const IMAGE_SRC = 'https://dev.odyssey.ninja/api/v3/render/get/df32929bf3b6c3a2013a8b51040d8c61';

export default {
  title: 'Organisms/PostStakeView',
  component: PostStakeView,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostStakeView>;

const Template: Story<PostStakeViewPropsInterface> = (args) => {
  return <PostStakeView {...args} />;
};

export const General = Template.bind({});
General.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: true
  },
  entry: {
    id: '1',
    hashSrc: IMAGE_SRC,
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
    type: TimelineTypeEnum.WORLD_CREATE,
    created: '2023-06-09T11:07:25.064Z',
    objectId: '1',
    objectName: 'Odyssey #1',
    objectAvatarSrc: IMAGE_SRC,
    tokenAmount: '1.1',
    tokenSymbol: 'MOM'
  },
  onVisit: () => {}
};
