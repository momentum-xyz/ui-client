import {Meta, Story} from '@storybook/react';

import {Separator} from './Separator.styled';

export default {
  title: 'Atoms/Separator',
  component: Separator
} as Meta;

const Template: Story = (args) => (
  <div style={{width: 300, padding: 10, border: '1px solid blue'}}>
    Some text
    <Separator {...args} />
    Some text
  </div>
);

export const General = Template.bind({});
General.args = {};
