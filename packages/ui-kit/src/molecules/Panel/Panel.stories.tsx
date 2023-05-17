import {ComponentMeta, Story} from '@storybook/react';

import Panel, {PanelPropsInterface} from './Panel';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/Panel',
  component: Panel
} as ComponentMeta<typeof Panel>;

const Template: Story<PanelPropsInterface> = (args) => {
  return <Panel {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  size: 'normal',
  title: 'Long title of sidebar',
  variant: 'primary',
  icon: 'planet'
};

export const Secondary = Template.bind({});
Secondary.args = {
  size: 'normal',
  title: 'Long odyssey name',
  label: 'Connected',
  variant: 'secondary',
  image: IMAGE_SRC
};

export const Normal = Template.bind({});
Normal.args = {
  size: 'normal',
  title: 'Long title of sidebar',
  variant: 'primary',
  icon: 'planet'
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  title: 'Long title of sidebar',
  variant: 'primary',
  icon: 'planet'
};

export const Wide = Template.bind({});
Wide.args = {
  size: 'wide',
  title: 'Long title of sidebar',
  variant: 'primary',
  icon: 'planet'
};
