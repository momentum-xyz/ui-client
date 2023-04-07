import {ComponentMeta, Story} from '@storybook/react';

import Frame from './Frame';

const TEXT_LINE = 'Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.';

export default {
  title: 'Atoms/Frame',
  component: Frame,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Frame>;

const Template: Story = (args) => {
  return <Frame {...args} />;
};

export const General = Template.bind({});
General.args = {
  children: <div>{TEXT_LINE}</div>
};
