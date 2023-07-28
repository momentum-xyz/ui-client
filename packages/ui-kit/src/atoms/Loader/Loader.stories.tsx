import {Meta, Story} from '@storybook/react';

import Loader, {LoaderPropsInterface} from './Loader';

export default {
  title: 'Atoms/Loader',
  component: Loader
} as Meta;

const Template: Story<LoaderPropsInterface> = (args) => <Loader {...args} />;

export const General = Template.bind({});
General.args = {};

export const Fill = Template.bind({});
Fill.args = {
  fill: true
};
