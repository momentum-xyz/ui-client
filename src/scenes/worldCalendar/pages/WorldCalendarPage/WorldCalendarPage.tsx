import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router';
import {t} from 'i18next';

import {TopBar, EventList, LinkDialog} from 'ui-kit';
import {useStore} from 'shared/hooks';
import UnityService from 'context/Unity/UnityService';
import {absoluteLink} from 'core/utils';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';
import {ROUTES} from 'core/constants';

import * as styled from './WorldCalendarPage.styled';

const WorldCalendarPage: FC = () => {
  const history = useHistory();
  // @ts-ignore
  const {
    worldCalendarStore: {calendarStore},
    mainStore: {worldStore, unityStore},
    sessionStore,
    widgetStore: {attendeesListStore}
  } = useStore();
  const {magicDialog, eventListStore} = calendarStore;
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();

  const handleMagicLinkOpen = useCallback(
    (eventId: string, spaceId?: string) => {
      if (spaceId) {
        calendarStore.showMagicLink(spaceId, eventId);
      }
    },
    [worldStore.worldId]
  );

  useEffect(() => {
    eventListStore.fetchEvents(worldStore.worldId, true);

    return () => eventListStore.resetModel();
  }, [worldStore.worldId]);

  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleFlyToGathering = (spaceId: string) => {
    if (spaceId) {
      UnityService.teleportToSpace(spaceId);

      joinMeetingSpace(spaceId).then(() => {
        unityStore.pause();
        history.push({pathname: ROUTES.collaboration});
      });
    }
  };

  const handleFlyToSpace = (spaceId: string) => {
    if (spaceId) {
      UnityService.teleportToSpace(spaceId);
      history.push(ROUTES.base);

      if (process.env.NODE_ENV === 'development') {
        joinMeetingSpace(spaceId);
      }
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
      <TopBar title="World Calendar" onClose={() => history.goBack()} />
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
