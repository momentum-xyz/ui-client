import {ComponentMeta, Story} from '@storybook/react';

import StakeCard, {StakeCardPropsInterface} from './StakeCard';

export default {
  title: 'Molecules/StakeCard',
  component: StakeCard,
  decorators: [
    (Story) => (
      <div className="storybook-block-2">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof StakeCard>;

const Template: Story<StakeCardPropsInterface> = (args) => {
  return <StakeCard {...args} />;
};

export const General = Template.bind({});
General.args = {
  nftName: 'A NAME of ODYSSEY LOOOOOOOOOONG',
  nftImageUrl: 'https://picsum.photos/500',
  stakedAmount: 10.982,
  rewardAmount: 0.502,
  tokenSymbol: 'MOM',
  onInfoClick: () => {},
  onUnstakeClick: () => {},
  onStakeClick: () => {}
};
