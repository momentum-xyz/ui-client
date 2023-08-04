import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Voting, {VotingPropsInterface} from './Voting';

export default {
  title: 'Molecules/Voting',
  component: Voting
} as ComponentMeta<typeof Voting>;

const Template: Story<VotingPropsInterface> = (args) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [count, setCount] = useState(9);

  return (
    <Voting
      {...args}
      count={count}
      isActive={isActive}
      onClick={() => {
        setIsActive(!isActive);
        setCount(isActive ? count - 1 : count + 1);
      }}
    />
  );
};

export const General = Template.bind({});
General.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true
};
