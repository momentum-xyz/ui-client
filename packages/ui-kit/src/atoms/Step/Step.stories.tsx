import {ComponentMeta, Story} from '@storybook/react';

import Step, {StepPropsInterface} from './Step';

export default {
  title: 'Atoms/Step',
  component: Step
} as ComponentMeta<typeof Step>;

const Template: Story<StepPropsInterface> = (args) => {
  return <Step {...args} />;
};

export const Active = Template.bind({});
Active.args = {
  variant: 'active',
  label: '1'
};

export const Next = Template.bind({});
Next.args = {
  variant: 'next',
  label: '2'
};

export const Prev = Template.bind({});
Prev.args = {
  variant: 'prev',
  label: '2'
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  variant: 'next',
  icon: 'arrow'
};
