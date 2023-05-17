import {Meta, Story} from '@storybook/react';

import ProgressBar, {ProgressBarPropsInterface} from './ProgressBar';

export default {
  title: 'Atoms/ProgressBar',
  component: ProgressBar
} as Meta;

const Template: Story<ProgressBarPropsInterface> = (args) => <ProgressBar {...args} />;

export const General = Template.bind({});
General.args = {
  percent: 50
};
