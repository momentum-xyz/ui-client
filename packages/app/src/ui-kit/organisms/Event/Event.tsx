import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {EventItemModelInterface, UserModelInterface} from 'core/models';
import placeholder from 'static/images/placeholder.png';

import {EventActions, EventTools, EventInformation, Attendees} from './components';
import * as styled from './Event.styled';

interface PropsInterface {
  event: EventItemModelInterface;
  user?: UserModelInterface;
  onEdit: (event: EventItemModelInterface) => void;
  onRemove: (event: EventItemModelInterface) => void;
  onMagicLinkOpen?: (eventId: string, spaceId?: string) => void;
  zIndex?: number;
  onFlyToSpace?: (spaceId: string) => void;
  onWeblinkClick: (weblink: string) => void;
  canManageEvent?: boolean;
}

const Event: FC<PropsInterface> = ({
  event,
  user,
  onEdit,
  onRemove,
  zIndex,
  onMagicLinkOpen,
  onFlyToSpace,
  onWeblinkClick,
  canManageEvent = true
}) => {
  return (
    <>
      <styled.Container
        style={{zIndex: zIndex}}
        id={event.data?.eventId}
        data-testid="EventItem-test"
      >
        <styled.Row className="header">
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
            {canManageEvent && <EventActions event={event} onEdit={onEdit} onRemove={onRemove} />}
          </styled.Info>
        </styled.Div>
      </styled.Container>

      {event.attendeesList.dialog.isOpen && (
        <Attendees attendeesList={event.attendeesList} event={event} />
      )}
    </>
  );
};

export default observer(Event);
