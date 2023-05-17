import {ComponentMeta, Story} from '@storybook/react';

import WalletHash, {WalletHashPropsInterface} from './WalletHash';

export default {
  title: 'Atoms/WalletHash',
  component: WalletHash
} as ComponentMeta<typeof WalletHash>;

const Template: Story<WalletHashPropsInterface> = (args) => {
  return <WalletHash {...args} />;
};

export const General = Template.bind({});
General.args = {
  icon: 'talisman',
  hash: '5CtD3DvvwoTsEuAQ3ysN2Rd1raD72bSAw8SmCB11gB7mWmPn'
};
