import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {t} from 'i18next';
import {toast} from 'react-toastify';
import {useHistory} from 'react-router';
import {Button} from '@momentum-xyz/ui-kit';
import {absoluteLink} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {
  EventList,
  LinkDialog,
  ToastContent,
  SpaceTopBar,
  DeleteEventDialog,
  SpacePage
} from 'ui-kit';

import {EventForm} from './components';
import * as styled from './CalendarPage.styled';

const CalendarPage: FC = () => {
  const {collaborationStore, sessionStore, widgetStore, mainStore, leaveMeetingSpace} = useStore();
  const {calendarStore, spaceStore} = collaborationStore;
  const {favoriteStore} = mainStore;
  const {eventList, formDialog, magicDialog, deleteConfirmationDialog} = calendarStore;
  const {attendeesListStore} = widgetStore;

  const theme = useTheme();
  const history = useHistory();

  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleEventForm = () => {
    formDialog.open();
  };

  const handleMagicLinkOpen = (eventId: string) => {
    if (spaceStore) {
      calendarStore.showMagicLink(spaceStore.id, eventId);
    }
  };

  const handleEventDelete = async () => {
    if (spaceStore) {
      if (await calendarStore.removeEvent(spaceStore.id)) {
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

  useEffect(() => {
    if (spaceStore) {
      eventList.fetchEvents(spaceStore.id);
    }

    return () => eventList.resetModel();
  }, [eventList, spaceStore]);

  if (!spaceStore) {
    return null;
  }

  return (
    <SpacePage dataTestId="CalendarPage-test">
      <SpaceTopBar
        title={spaceStore.space?.name ?? ''}
        subtitle="calendar"
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.id}
        isSpaceFavorite={favoriteStore.isFavorite(spaceStore.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        showChatButton={false}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {spaceStore.isAdmin && (
          <Button variant="primary" label="Add Gathering" theme={theme} onClick={handleEventForm} />
        )}
      </SpaceTopBar>
      <styled.InnerContainer>
        <EventList
          currentUserId={sessionStore.userId}
          events={eventList.events}
          onMagicLinkOpen={handleMagicLinkOpen}
          isLoading={eventList.areEventsLoading}
          onEventEdit={calendarStore.editEvent}
          onEventRemove={calendarStore.selectEventToRemove}
          onWeblinkClick={handleWeblink}
          onShowAttendeesList={attendeesListStore.showAttendees}
          canManageInSpace={spaceStore.isAdmin}
        />
      </styled.InnerContainer>
      {calendarStore.formDialog.isOpen && <EventForm />}

      {calendarStore.magicId && magicDialog.isOpen && (
        <LinkDialog
          theme={theme}
          title={t('eventList.eventItem.magicLinkDialog.title')}
          copyLabel={t('eventList.eventItem.magicLinkDialog.copyLabel')}
          link={`${window.location.protocol}//${window.location.host}/magic/${calendarStore.magicId}`}
          onClose={magicDialog.close}
        />
      )}

      {deleteConfirmationDialog.isOpen && (
        <DeleteEventDialog
          onConfirmation={handleEventDelete}
          onClose={deleteConfirmationDialog.close}
        />
      )}
    </SpacePage>
  );
};

export default observer(CalendarPage);
