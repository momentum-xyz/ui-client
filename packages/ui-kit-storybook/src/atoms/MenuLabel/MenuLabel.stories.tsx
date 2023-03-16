import {Meta, Story} from '@storybook/react';

import MenuLabel, {MenuLabelPropsInterface} from './MenuLabel';

export default {
  title: 'Atoms/MenuLabel',
  component: MenuLabel
} as Meta;

const Template: Story<MenuLabelPropsInterface> = (args) => (
  <MenuLabel {...args} text="Lorem ipsum" />
);

export const Right = Template.bind({});
Right.args = {
  type: 'right'
};

export const RightBold = Template.bind({});
RightBold.args = {
  type: 'bold-right'
};

export const Left = Template.bind({});
Left.args = {
  type: 'left'
};

export const LeftBold = Template.bind({});
LeftBold.args = {
  type: 'bold-left'
};
