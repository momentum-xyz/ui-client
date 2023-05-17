import {ComponentMeta, Story} from '@storybook/react';

import Steps, {StepsPropsInterface} from './Steps';

export default {
  title: 'Molecules/Steps',
  component: Steps
} as ComponentMeta<typeof Steps>;

const Template: Story<StepsPropsInterface<string>> = (args) => {
  return <Steps {...args} />;
};

export const General = Template.bind({});
General.args = {
  stepList: [
    {id: '1', label: '1', variant: 'prev'},
    {id: '2', label: '2', variant: 'active'},
    {id: '3', label: '3', variant: 'next'}
  ]
};
