import {ComponentMeta, Story} from '@storybook/react';
import {PostTypeEnum} from '@momentum-xyz/core';

import PostVideoView, {PostVideoViewPropsInterface} from './PostVideoView';

const VIDEO_SRC = 'https://dev.odyssey.ninja/api/v3/render/video/982e3e3d937bb8bdf83ea13f666119fb';

export default {
  title: 'Organisms/PostVideoView',
  component: PostVideoView,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostVideoView>;

const Template: Story<PostVideoViewPropsInterface> = (args) => {
  return <PostVideoView {...args} />;
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
    hashSrc: VIDEO_SRC,
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
    type: PostTypeEnum.VIDEO,
    created: '2023-06-09T11:07:25.064Z',
    objectId: '1',
    objectName: 'Odyssey #1'
  },
  onShare: () => {},
  onVisit: () => {}
};
