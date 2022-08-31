import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {Loader, PanelLayout, Text, EventItem} from 'ui-kit';
import {EventItemModelInterface} from 'core/models';

import * as styled from './EventList.styled';

interface PropsInterface {
  currentUserId: string;
  events: EventItemModelInterface[];
  onMagicLinkOpen: (eventId: string, spaceId?: string) => void;
  isLoading: boolean;
  isWorld?: boolean;
  onEventEdit?: (event: EventItemModelInterface) => void;
  onEventRemove?: (eventId: string) => void;
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
  isWorld = false,
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
          <PanelLayout className="no-gatherings-panel">
            <Text className="no-gatherings-text" text={t('eventList.noGatherings')} size="l" />
          </PanelLayout>
        )}
      </styled.Container>
    );
  }

  return (
    <styled.Container className="noScrollIndicator" data-testid="EventList-test">
      {events.map((event, index) => (
        <EventItem
          currentUserId={currentUserId}
          zIndex={events.length - index}
          key={event?.id}
          event={event}
          onEdit={onEventEdit}
          onRemove={onEventRemove}
          onMagicLinkOpen={onMagicLinkOpen}
          isWorldCalendar={isWorld}
          onFlyToGathering={onFlyToGathering}
          onFlyToSpace={onFlyToSpace}
          onWeblinkClick={onWeblinkClick}
          onShowAttendeesList={onShowAttendeesList}
        />
      ))}
    </styled.Container>
  );
};

export default observer(EventList);
