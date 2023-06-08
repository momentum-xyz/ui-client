import {ComponentMeta, Story} from '@storybook/react';

import PostVideoForm, {PostVideoFormPropsInterface} from './PostVideoForm';

export default {
  title: 'Molecules/PostVideoForm',
  component: PostVideoForm,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostVideoForm>;

const Template: Story<PostVideoFormPropsInterface> = (args) => {
  return <PostVideoForm {...args} />;
};

export const General = Template.bind({});
General.args = {
  video: undefined,
  isPending: false,
  isScreenRecording: false,
  maxVideoDurationSec: 15,
  onStartRecording: () => {},
  onStopRecording: () => {},
  onClearVideo: () => {},
  onCreateOrUpdate: (form) => console.log(form),
  onCancel: () => {}
};
