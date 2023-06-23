import {ComponentMeta, Story} from '@storybook/react';
import {TimelineTypeEnum} from '@momentum-xyz/core';

import PostImageForm, {PostImageFormPropsInterface} from './PostImageForm';

const IMAGE_SRC = 'https://dev.odyssey.ninja/api/v3/render/get/df32929bf3b6c3a2013a8b51040d8c61';

export default {
  title: 'Organisms/PostImageForm',
  component: PostImageForm,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostImageForm>;

const Template: Story<PostImageFormPropsInterface> = (args) => {
  return (
    <PostImageForm
      {...args}
      onMakeScreenshot={() => {}}
      onCreateOrUpdate={() => new Promise(() => true)}
      onClearScreenshot={() => {}}
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
    hashSrc: IMAGE_SRC,
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
    type: TimelineTypeEnum.SCREENSHOT,
    created: '2023-06-09T11:07:25.064Z',
    objectId: '1',
    objectName: 'Odyssey #1'
  }
};
