import {ComponentMeta, Story} from '@storybook/react';

import PostImageForm, {PostImageFormPropsInterface} from './PostImageForm';

export default {
  title: 'Molecules/PostImageForm',
  component: PostImageForm,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostImageForm>;

const Template: Story<PostImageFormPropsInterface> = (args) => {
  return <PostImageForm {...args} />;
};

export const General = Template.bind({});
General.args = {
  screenshot: undefined,
  isPending: false,
  onMakeScreenshot: () => {},
  onClearScreenshot: () => {},
  onCreateOrUpdate: (form) => console.log(form),
  onCancel: () => {}
};
