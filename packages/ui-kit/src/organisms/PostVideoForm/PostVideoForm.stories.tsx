import {ComponentMeta, Story} from '@storybook/react';
import {TimelineTypeEnum} from '@momentum-xyz/core';

import PostVideoForm, {PostVideoFormPropsInterface} from './PostVideoForm';

const VIDEO_SRC = 'https://dev.odyssey.ninja/api/v3/render/video/982e3e3d937bb8bdf83ea13f666119fb';

export default {
  title: 'Organisms/PostVideoForm',
  component: PostVideoForm,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostVideoForm>;

const Template: Story<PostVideoFormPropsInterface> = (args) => {
  return (
    <PostVideoForm
      {...args}
      onStartRecording={() => {}}
      onStopRecording={() => {}}
      onCreateOrUpdate={() => new Promise(() => true)}
      onClearVideo={() => {}}
      onCancel={() => {}}
    />
  );
};

export const NewForm = Template.bind({});
NewForm.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: true
  }
};

export const EditForm = Template.bind({});
EditForm.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: false
  },
  entry: {
    id: '1',
    hashSrc: VIDEO_SRC,
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
    type: TimelineTypeEnum.VIDEO,
    created: '2023-06-09T11:07:25.064Z',
    objectId: '1',
    objectName: 'Odyssey #1'
  }
};
