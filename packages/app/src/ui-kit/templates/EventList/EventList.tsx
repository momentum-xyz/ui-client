import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {PropsWithThemeInterface, Loader} from '@momentum-xyz/ui-kit';

import {EventItem} from 'ui-kit';
import {EventItemModelInterface, UserModelInterface} from 'core/models';

import * as styled from './EventList.styled';

interface PropsInterface extends PropsWithThemeInterface {
  user?: UserModelInterface;
  events: EventItemModelInterface[];
  onMagicLinkOpen: (eventId: string, spaceId?: string) => void;
  isLoading: boolean;
  showOnWorldCalendar?: boolean;
  canManageInSpace?: boolean;
  onEventEdit: (event: EventItemModelInterface) => void;
  onEventRemove: (event: EventItemModelInterface) => void;
  onFlyToGathering?: (spaceId: string) => void;
  onFlyToSpace?: (spaceId: string) => void;
  onWeblinkClick: (weblink: string) => void;
}

const EventList: FC<PropsInterface> = ({
  user,
  events,
  onEventEdit,
  onEventRemove,
  onMagicLinkOpen,
  isLoading,
  showOnWorldCalendar = false,
  canManageInSpace = false,
  onFlyToGathering,
  onFlyToSpace,
  onWeblinkClick
}) => {
  if (events.length === 0) {
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
      {events.map((event, index) => (
        <EventItem
          user={user}
          zIndex={events.length - index}
          key={event.data?.eventId}
          event={event}
          onEdit={onEventEdit}
          onRemove={onEventRemove}
          onMagicLinkOpen={onMagicLinkOpen}
          showOnWorldCalendar={showOnWorldCalendar}
          onFlyToGathering={onFlyToGathering}
          onFlyToSpace={onFlyToSpace}
          onWeblinkClick={onWeblinkClick}
          // onShowAttendeesList={event.attendeesDetails.showAttendees}
          canManageEvent={canManageInSpace}
        />
      ))}
    </styled.Container>
  );
};

export default observer(EventList);
