import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';
import {PageTopBar} from '@momentum/ui-kit';
import {absoluteLink} from '@momentum/core';

import {useStore} from 'shared/hooks';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {EventList, LinkDialog, DeleteEventDialog, ToastContent} from 'ui-kit';

import {EventForm} from './components';
import * as styled from './WorldCalendarPage.styled';

const WorldCalendarPage: FC = () => {
  const {worldCalendarStore, mainStore, sessionStore, widgetStore} = useStore();
  const {calendarStore} = worldCalendarStore;
  const {magicDialog, eventList, deleteConfirmationDialog, spaceId} = calendarStore;
  const {worldStore, unityStore} = mainStore;
  const {attendeesListStore} = widgetStore;

  const {t} = useTranslation();
  const history = useHistory();
  const theme = useTheme();

  const handleMagicLinkOpen = useCallback(
    (eventId: string, spaceId?: string) => {
      if (spaceId) {
        calendarStore.showMagicLink(spaceId, eventId);
      }
    },
    [calendarStore]
  );

  useEffect(() => {
    eventList.fetchEvents(worldStore.worldId, true);

    return () => {
      eventList.resetModel();
    };
  }, [eventList, worldStore.worldId]);

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

  const handleClose = () => {
    // @ts-ignore
    if (history.location.state?.canGoBack) {
      history.goBack();
    } else {
      history.push(ROUTES.base);
    }
  };

  return (
    <styled.Container data-testid="WorldCalendarPage-test">
      <PageTopBar title={t('labels.calendar')} onClose={handleClose} />
      <EventList
        currentUserId={sessionStore.userId}
        events={eventList.events}
        onMagicLinkOpen={handleMagicLinkOpen}
        isLoading={false}
        onEventEdit={calendarStore.editEvent}
        onEventRemove={calendarStore.selectEventToRemove}
        onWeblinkClick={handleWeblink}
        onFlyToSpace={handleFlyToSpace}
        onFlyToGathering={handleFlyToGathering}
        onShowAttendeesList={attendeesListStore.showAttendees}
        showOnWorldCalendar
      />

      {calendarStore.magicId && magicDialog.isOpen && (
        <LinkDialog
          theme={theme}
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
    </styled.Container>
  );
};

export default observer(WorldCalendarPage);
