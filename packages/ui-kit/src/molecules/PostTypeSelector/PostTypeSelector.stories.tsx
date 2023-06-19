import {ComponentMeta, Story} from '@storybook/react';

import PostTypeSelector, {PostTypeSelectorPropsInterface} from './PostTypeSelector';

export default {
  title: 'Molecules/PostTypeSelector',
  component: PostTypeSelector,

  decorators: [
    (Story) => (
      <div style={{width: `400px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof PostTypeSelector>;

const Template: Story<PostTypeSelectorPropsInterface> = (args) => {
  return <PostTypeSelector {...args} />;
};

export const General = Template.bind({});
General.args = {
  author: {
    id: 'user_2',
    name: 'John Doe',
    avatarSrc: 'https://picsum.photos/202',
    isItMe: true
  },
  onSelect: (type) => console.log(type)
};
