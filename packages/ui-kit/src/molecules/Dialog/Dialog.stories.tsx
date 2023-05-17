import {Meta, Story} from '@storybook/react';

import Dialog, {DialogPropsInterface} from './Dialog';

export default {
  title: 'Molecules/Dialog',
  component: Dialog
} as Meta;

const Template: Story<DialogPropsInterface> = (args) => (
  <Dialog {...args}>Some content should be there.</Dialog>
);

export const General = Template.bind({});
General.args = {
  title: 'My Dialog',
  icon: 'rabbit_fill',
  approveInfo: {
    title: 'Approve',
    onClick: () => {}
  },
  declineInfo: {
    title: 'Decline',
    onClick: () => {}
  },
  onClose: () => {}
};
