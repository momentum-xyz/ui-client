import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import CalendarButtons, {CalendarButtonsPropsInterface} from './CalendarButtons';

export default {
  title: 'Molecules/CalendarButtons',
  component: CalendarButtons
} as ComponentMeta<typeof CalendarButtons>;

const Template: Story<CalendarButtonsPropsInterface> = (args) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [joined, setJointed] = useState(false);
  return (
    <CalendarButtons
      {...args}
      isFavorite={isFavorite}
      attendeesLabel={joined ? `9 Attendees` : `8 Attendees`}
      joinLabel={joined ? `Leave moment` : `Join moment`}
      onJoinClick={() => setJointed(!joined)}
      onFavoriteClick={() => setIsFavorite(!isFavorite)}
    />
  );
};

export const General = Template.bind({});
General.args = {};
