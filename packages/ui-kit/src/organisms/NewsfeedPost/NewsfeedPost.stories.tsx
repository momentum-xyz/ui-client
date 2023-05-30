import {ComponentMeta, Story} from '@storybook/react';

import NewsfeedPost, {AuthorInterface, NewsfeedPostPropsInterface} from './NewsfeedPost';

export default {
  title: 'Organisms/NewsfeedPost',
  component: NewsfeedPost,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof NewsfeedPost>;

const author: AuthorInterface = {
  id: 'user_2',
  name: 'John Doe',
  avatarSrc: 'https://picsum.photos/202'
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Template: Story<NewsfeedPostPropsInterface> = (args) => {
  return <NewsfeedPost {...args} />;
};

export const General = Template.bind({});
General.args = {
  author
};
