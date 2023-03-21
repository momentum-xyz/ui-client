import {ComponentMeta, Story} from '@storybook/react';

import TimelineCap, {TimelineCapPropsInterface} from './TimelineCap';

export default {
  title: 'Molecules/TimelineCap',
  component: TimelineCap,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof TimelineCap>;

const Template: Story<TimelineCapPropsInterface> = (args) => {
  return <TimelineCap {...args} />;
};

export const General = Template.bind({});
General.args = {
  title: 'Name of Odyssey',
  dateISO: new Date().toISOString(),
  imageSrc: 'https://picsum.photos/300'
};

export const LongName = Template.bind({});
LongName.args = {
  title: 'Loooooooooooooong name of Odyssey',
  dateISO: new Date().toISOString(),
  imageSrc: 'https://picsum.photos/300'
};
