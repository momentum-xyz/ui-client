import {ComponentMeta, Story} from '@storybook/react';

import StakingAmount, {StakingAmountPropsInterface} from './StakingAmount';

export default {
  title: 'Molecules/StakingAmount',
  component: StakingAmount,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof StakingAmount>;

const Template: Story<StakingAmountPropsInterface> = (args) => {
  return <StakingAmount {...args} />;
};

export const General = Template.bind({});
General.args = {
  username: 'Name of Odyssey',
  amount: 10.563,
  rewardsAmount: 1.01,
  tokenSymbol: 'MOM'
};
