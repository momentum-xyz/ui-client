import {ComponentMeta, Story} from '@storybook/react';

import CommentForm, {CommentFormPropsInterface} from './CommentForm';

export default {
  title: 'Molecules/CommentForm',
  component: CommentForm,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof CommentForm>;

const Template: Story<CommentFormPropsInterface> = (args) => {
  return <CommentForm {...args} />;
};

export const General = Template.bind({});
General.args = {
  author: 'Name of author',
  onComment: (value) => console.log(value),
  onCancel: () => {}
};
