import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {EventItemInterface, UserModelInterface} from 'core/models';
import placeholder from 'static/images/placeholder.png';

import {EventActions, EventTools, EventInformation, Attendees} from './components';
import * as styled from './EventItem.styled';

interface PropsInterface {
  event: EventItemInterface;
  user?: UserModelInterface;
  onEdit: (event: EventItemInterface) => void;
  onRemove: (event: EventItemInterface) => void;
  onWeblinkClick: (weblink: string) => void;
}

const EventItem: FC<PropsInterface> = ({event, user, onEdit, onRemove, onWeblinkClick}) => {
  return (
    <styled.Container data-testid="EventItem-test">
      <styled.Row>
        <styled.ImageContainer>
          {event.data ? (
            <img alt={event.data.image ?? ''} src={event.imageSrc} />
          ) : (
            <img alt="placeholder" src={placeholder} />
          )}
        </styled.ImageContainer>
      </styled.Row>
      <styled.Div>
        <styled.Info>
          <EventInformation event={event} />
          <EventTools event={event} onWeblinkClick={onWeblinkClick} user={user} />
          <EventActions event={event} onEdit={onEdit} onRemove={onRemove} />
        </styled.Info>
      </styled.Div>

      {event.attendeesList.dialog.isOpen && (
        <Attendees attendeesList={event.attendeesList} event={event} />
      )}
    </styled.Container>
  );
};

export default observer(EventItem);
