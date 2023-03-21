import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import TimelineStars, {TimelineStarsPropsInterface} from './TimelineStars';

export default {
  title: 'Molecules/TimelineStars',
  component: TimelineStars,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof TimelineStars>;

const Template: Story<TimelineStarsPropsInterface> = (args) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <TimelineStars
      {...args}
      isStarActive={isActive}
      label={isActive ? `Remove star` : `Add star`}
      totalLabel={isActive ? `15 stars` : `14 stars`}
      onStarClick={() => setIsActive(!isActive)}
    />
  );
};

export const General = Template.bind({});
General.args = {
  linkLabel: 'Visit Odyssey',
  onLinkClick: () => {}
};

export const NoLink = Template.bind({});
NoLink.args = {};
