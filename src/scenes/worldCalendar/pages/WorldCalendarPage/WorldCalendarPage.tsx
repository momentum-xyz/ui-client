import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath} from 'react-router-dom';
import {useHistory} from 'react-router';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {PageTopBar, EventList, LinkDialog, DeleteEventDialog, ToastContent} from 'ui-kit';
import {absoluteLink} from 'core/utils';

import * as styled from './WorldCalendarPage.styled';
import {EventForm} from './components';

const WorldCalendarPage: FC = () => {
  const {worldCalendarStore, mainStore, sessionStore, widgetStore} = useStore();
  const {calendarStore} = worldCalendarStore;
  const {magicDialog, eventListStore, deleteConfirmationDialog, spaceId} = calendarStore;
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

  const handleEventDelete = async () => {
    if (worldStore.worldId && spaceId) {
      if (await calendarStore.removeEvent(spaceId, worldStore.worldId)) {
        toast.info(
          <ToastContent
            headerIconName="calendar"
            title={t('titles.alert')}
            text={t('messages.removeEventSuccess')}
            showCloseButton
          />
        );
      } else {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="calendar"
            title={t('titles.alert')}
            text={t('errors.couldNotRemoveEvent')}
            showCloseButton
          />
        );
      }
    }
  };

  return (
    <styled.Container data-testid="WorldCalendarPage-test">
      {calendarStore.magicId && magicDialog.isOpen && (
        <LinkDialog
          title={t('eventList.eventItem.magicLinkDialog.title')}
          copyLabel={t('eventList.eventItem.magicLinkDialog.copyLabel')}
          link={`${window.location.protocol}//${window.location.host}/magic/${calendarStore.magicId}`}
          onClose={magicDialog.close}
        />
      )}
      {calendarStore.formDialog.isOpen && <EventForm />}
      {deleteConfirmationDialog.isOpen && (
        <DeleteEventDialog
          onConfirmation={handleEventDelete}
          onClose={deleteConfirmationDialog.close}
        />
      )}
      <PageTopBar title="World Calendar" onClose={() => history.push(ROUTES.base)} />
      <EventList
        currentUserId={sessionStore.userId}
        events={eventListStore.events}
        onMagicLinkOpen={handleMagicLinkOpen}
        isLoading={false}
        onEventEdit={calendarStore.editEvent}
        onEventRemove={calendarStore.selectEventToRemove}
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
