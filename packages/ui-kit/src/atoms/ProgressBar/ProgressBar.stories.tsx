import {Meta, Story} from '@storybook/react';

import ProgressBar, {ProgressBarPropsInterface} from './ProgressBar';

export default {
  title: 'Atoms/ProgressBar',
  component: ProgressBar
} as Meta;

const Template: Story<ProgressBarPropsInterface> = (args) => (
  <div style={{width: 300}}>
    <ProgressBar {...args} />
  </div>
);

export const General = Template.bind({});
General.args = {
  percent: 50
};

export const WithLogo = Template.bind({});
WithLogo.args = {
  percent: 50,
  withLogo: true
};
