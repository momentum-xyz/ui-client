import {Meta, Story} from '@storybook/react';

import IconSvg, {IconSvgPropsInterface} from './IconSvg';

export default {
  title: 'Atoms/IconSvg',
  component: IconSvg
} as Meta;

const Template: Story<IconSvgPropsInterface> = (args) => <IconSvg {...args} />;

export const General = Template.bind({});
General.args = {
  size: 'large',
  name: 'fly-portal'
};
