import {Meta, Story} from '@storybook/react';

import {PropsWithThemeInterface} from '../../interfaces';

import Loader from './Loader';

export default {
  title: 'Atoms/Loader',
  component: Loader
} as Meta;

const Template: Story<PropsWithThemeInterface> = (args) => <Loader {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
