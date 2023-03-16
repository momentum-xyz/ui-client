import {ComponentMeta, Story} from '@storybook/react';

import TimelineItem, {TimelineItemPropsInterface} from './TimelineItem';

export default {
  title: 'Molecules/TimelineItem',
  component: TimelineItem,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof TimelineItem>;

const Template: Story<TimelineItemPropsInterface> = (args) => {
  return <TimelineItem {...args} />;
};

export const General = Template.bind({});
General.args = {
  title: 'Name of Odyssey',
  dateISO: '2023-03-16T11:11:27.690Z',
  imageSrc: 'https://picsum.photos/300/200'
};

export const LongName = Template.bind({});
LongName.args = {
  title: 'Loooooooooooooong name of Odyssey',
  dateISO: '2023-03-16T11:11:27.690Z',
  imageSrc: 'https://picsum.photos/300/200'
};
