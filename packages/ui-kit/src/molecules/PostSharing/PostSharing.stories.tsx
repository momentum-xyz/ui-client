import {ComponentMeta, Story} from '@storybook/react';

import PostSharing, {PostSharingPropsInterface} from './PostSharing';

export default {
  title: 'Molecules/PostSharing',
  component: PostSharing,

  decorators: [
    (Story) => (
      <div style={{width: `380px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostSharing>;

const Template: Story<PostSharingPropsInterface> = (args) => {
  return <PostSharing {...args} />;
};

export const General = Template.bind({});
General.args = {
  title: 'Odyssey #1',
  targetUrl: 'https://dev.odyssey.ninja/odyssey/00000000-0000-8000-8000-000000000001',
  onClose: () => console.log('Closing')
};
