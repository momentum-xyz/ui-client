import {ComponentMeta, Story} from '@storybook/react';

import SystemWideError, {SystemWideErrorPropsInterface} from './SystemWideError';

export default {
  title: 'Molecules/SystemWideError',
  component: SystemWideError
} as ComponentMeta<typeof SystemWideError>;

const Template: Story<SystemWideErrorPropsInterface> = (args) => {
  return <SystemWideError {...args} />;
};

export const General = Template.bind({});
General.args = {
  text: 'The server is undergoing maintenance, please try again later'
};

export const WidthRefresh = Template.bind({});
WidthRefresh.args = {
  text: 'The server is undergoing maintenance, please try again later',
  showRefreshButton: true
};

export const TwoLines = Template.bind({});
TwoLines.args = {
  text: [
    'The server is undergoing maintenance, please try again later',
    'Sorry, maintenance time ...'
  ],
  showRefreshButton: true
};
