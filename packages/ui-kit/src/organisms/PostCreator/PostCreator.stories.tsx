import {ComponentMeta, Story} from '@storybook/react';

import PostCreator, {PostCreatorPropsInterface} from './PostCreator';

export default {
  title: 'Organisms/PostCreator',
  component: PostCreator,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostCreator>;

const Template: Story<PostCreatorPropsInterface> = (args) => {
  return <PostCreator {...args} />;
};

export const General = Template.bind({});
General.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202'
  },
  maxVideoDurationSec: 15,
  onMakeScreenshot: () => {},
  onStartRecording: () => {},
  onStopRecording: () => {},
  onCreatePost: () => new Promise(() => true),
  onClearVideoOrScreenshot: () => {},
  onCancel: () => {}
};
