import {ComponentMeta, Story} from '@storybook/react';

import CalendarCap, {CalendarCapPropsInterface} from './CalendarCap';

export default {
  title: 'Molecules/CalendarCap',
  component: CalendarCap,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof CalendarCap>;

const Template: Story<CalendarCapPropsInterface> = (args) => {
  return <CalendarCap {...args} />;
};

export const General = Template.bind({});
General.args = {
  name: 'Name of Odyssey',
  dateISO: '2023-03-16T11:11:27.690Z'
};
