import {ComponentMeta, Story} from '@storybook/react';

import Comment, {CommentPropsInterface} from './Comment';

export default {
  title: 'Molecules/Comment',
  component: Comment,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Comment>;

const Template: Story<CommentPropsInterface> = (args) => {
  return <Comment {...args} />;
};

export const General = Template.bind({});
General.args = {
  author: 'Name of author',
  dateISO: new Date().toISOString(),
  message: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
  onDelete: undefined
};

export const Deletable = Template.bind({});
Deletable.args = {
  author: 'Name of author',
  dateISO: new Date().toISOString(),
  message: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
  onDelete: () => console.log('Delete')
};
