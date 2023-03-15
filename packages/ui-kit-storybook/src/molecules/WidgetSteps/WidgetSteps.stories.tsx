import {ComponentMeta, Story} from '@storybook/react';

import WidgetSteps, {WidgetStepsPropsInterface} from './WidgetSteps';

export default {
  title: 'Molecules/WidgetSteps',
  component: WidgetSteps,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof WidgetSteps>;

const Template: Story<WidgetStepsPropsInterface> = (args) => {
  return <WidgetSteps {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  stepList: [
    {label: '1', variant: 'prev'},
    {label: '2', variant: 'active'},
    {label: '3', variant: 'next'}
  ]
};
