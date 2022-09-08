import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Loader, EventItem} from 'ui-kit';
import {EventItemInterface} from 'core/models';

import * as styled from './EventList.styled';

interface PropsInterface {
  currentUserId: string;
  events: EventItemInterface[];
  onMagicLinkOpen: (eventId: string, spaceId?: string) => void;
  isLoading: boolean;
  showOnWorldCalendar?: boolean;
  canManageInSpace?: boolean;
  onEventEdit: (event: EventItemInterface) => void;
  onEventRemove: (event: EventItemInterface) => void;
  onFlyToGathering?: (spaceId: string) => void;
  onFlyToSpace?: (spaceId: string) => void;
  onWeblinkClick: (weblink: string) => void;
  onShowAttendeesList: (eventName: string, eventId: string, spaceId: string) => void;
}

const EventList: FC<PropsInterface> = ({
  currentUserId,
  events,
  onEventEdit,
  onEventRemove,
  onMagicLinkOpen,
  isLoading,
  showOnWorldCalendar = false,
  canManageInSpace = false,
  onFlyToGathering,
  onFlyToSpace,
  onWeblinkClick,
  onShowAttendeesList
}) => {
  if (isLoading || events.length === 0) {
    return (
      <styled.Container className="empty noScrollIndicator">
        {isLoading ? (
          <Loader />
        ) : (
          <styled.NoGatheringsPanel>
            <styled.NoGatheringsText text={t('eventList.noGatherings')} size="l" />
          </styled.NoGatheringsPanel>
        )}
      </styled.Container>
    );
  }

  return (
    <styled.Container className="noScrollIndicator" data-testid="EventList-test">
      {/* TODO: should replace event.spaceAdmin with showOnWorldCalendar in canManageSpace*/}
      {events.map((event, index) => (
        <EventItem
          currentUserId={currentUserId}
          zIndex={events.length - index}
          key={event?.data?.id}
          event={event}
          onEdit={onEventEdit}
          onRemove={onEventRemove}
          onMagicLinkOpen={onMagicLinkOpen}
          showOnWorldCalendar={showOnWorldCalendar}
          onFlyToGathering={onFlyToGathering}
          onFlyToSpace={onFlyToSpace}
          onWeblinkClick={onWeblinkClick}
          onShowAttendeesList={onShowAttendeesList}
          canManageEvent={canManageInSpace || showOnWorldCalendar}
        />
      ))}
    </styled.Container>
  );
};

export default observer(EventList);
