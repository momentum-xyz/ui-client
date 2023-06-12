import {ComponentMeta, Story} from '@storybook/react';
import {PostTypeEnum} from '@momentum-xyz/core';

import PostEntry, {PostEntryPropsInterface} from './PostEntry';

const IMAGE_SRC = 'https://picsum.photos/300';
const VIDEO_SRC = 'https://dev.odyssey.ninja/api/v3/render/video/982e3e3d937bb8bdf83ea13f666119fb';

export default {
  title: 'Organisms/PostEntry',
  component: PostEntry,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostEntry>;

const Template: Story<PostEntryPropsInterface> = (args) => {
  return (
    <PostEntry
      {...args}
      onMakeScreenshot={() => {}}
      onStartRecording={() => {}}
      onStopRecording={() => {}}
      onCreateOrUpdatePost={() => new Promise(() => true)}
      onClearVideoOrScreenshot={() => {}}
      onCancel={() => {}}
    />
  );
};

export const Creator = Template.bind({});
Creator.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: true
  },
  entry: undefined
};

export const ImageView = Template.bind({});
ImageView.args = {
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
    type: PostTypeEnum.SCREENSHOT,
    created: '2023-06-09T11:07:25.064Z',
    objectId: '1',
    objectName: 'Odyssey #1'
  },
  onShare: () => {},
  onVisit: () => {}
};

export const VideoView = Template.bind({});
VideoView.args = {
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
