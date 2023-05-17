import {ComponentMeta, Story} from '@storybook/react';

import NewsList, {NewsListPropsInterface} from './NewsList';

export default {
  title: 'Organisms/NewsList',
  component: NewsList,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof NewsList>;

const Template: Story<NewsListPropsInterface> = (args) => {
  return <NewsList {...args} />;
};

export const General = Template.bind({});
General.args = {
  title: 'Newsfeed'
};
