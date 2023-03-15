import {ComponentMeta, Story} from '@storybook/react';

import FrameSteps, {FrameStepsPropsInterface} from './FrameSteps';

export default {
  title: 'Molecules/FrameSteps',
  component: FrameSteps,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof FrameSteps>;

const Template: Story<FrameStepsPropsInterface> = (args) => {
  return <FrameSteps {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  stepList: [
    {label: '1', variant: 'prev'},
    {label: '2', variant: 'active'},
    {label: '3', variant: 'next'}
  ]
};
