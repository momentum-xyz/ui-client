import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath} from 'react-router-dom';
import {useHistory} from 'react-router';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {PageTopBar, EventList, LinkDialog} from 'ui-kit';
import {absoluteLink} from 'core/utils';

import * as styled from './WorldCalendarPage.styled';

const WorldCalendarPage: FC = () => {
  const {worldCalendarStore, mainStore, sessionStore, widgetStore} = useStore();
  const {calendarStore} = worldCalendarStore;
  const {magicDialog, eventListStore} = calendarStore;
  const {worldStore, unityStore} = mainStore;
  const {attendeesListStore} = widgetStore;

  const history = useHistory();

  const handleMagicLinkOpen = useCallback(
    (eventId: string, spaceId?: string) => {
      if (spaceId) {
        calendarStore.showMagicLink(spaceId, eventId);
      }
    },
    [calendarStore]
  );

  useEffect(() => {
    eventListStore.fetchEvents(worldStore.worldId, true);

    return () => eventListStore.resetModel();
  }, [eventListStore, worldStore.worldId]);

  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleFlyToGathering = (spaceId: string) => {
    if (spaceId) {
      history.push(ROUTES.base);
      unityStore.teleportToSpace(spaceId);
      setTimeout(() => {
        history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
      }, TELEPORT_DELAY_MS);
    }
  };

  const handleFlyToSpace = (spaceId: string) => {
    if (spaceId) {
      unityStore.teleportToSpace(spaceId);
      history.push(ROUTES.base);
    }
  };

  return (
    <styled.Container>
      {calendarStore.magicId && magicDialog.isOpen && (
        <LinkDialog
          title={t('eventList.eventItem.magicLinkDialog.title')}
          copyLabel={t('eventList.eventItem.magicLinkDialog.copyLabel')}
          link={`${window.location.protocol}//${window.location.host}/magic/${calendarStore.magicId}`}
          onClose={magicDialog.close}
        />
      )}
      <PageTopBar title="World Calendar" onClose={() => history.goBack()} />
      <EventList
        currentUserId={sessionStore.userId}
        events={eventListStore.events}
        onMagicLinkOpen={handleMagicLinkOpen}
        isLoading={false}
        onWeblinkClick={handleWeblink}
        onFlyToSpace={handleFlyToSpace}
        onFlyToGathering={handleFlyToGathering}
        onShowAttendeesList={attendeesListStore.showAttendees}
        isWorld
      />
    </styled.Container>
  );
};

export default observer(WorldCalendarPage);
