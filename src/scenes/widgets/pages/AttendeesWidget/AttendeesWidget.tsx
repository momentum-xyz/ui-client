import {FC} from 'react';

import {useStore} from 'shared/hooks';
import {Dialog} from 'ui-kit';

import * as styled from './AttendeesWidget.styled';

const AttendeesWidget: FC = () => {
  const {
    widgetStore: {attendeesListStore}
  } = useStore();

  return (
    <Dialog>
      <styled.Container>
        {attendeesListStore.attendees.map((attendee) => (
          <div key={attendee.id}>{attendee.name}</div>
        ))}
      </styled.Container>
    </Dialog>
  );
};

export default AttendeesWidget;
