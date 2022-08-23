import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {t} from 'i18next';
import {toast} from 'react-toastify';
import {useHistory} from 'react-router';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {absoluteLink} from 'core/utils';
import {Button, EventList, LinkDialog, ToastContent, SpaceTopBar} from 'ui-kit';

import {DeleteEventConfirmationDialog, EventForm} from './components';
import * as styled from './CalendarPage.styled';

const CalendarPage: FC = () => {
  const {collaborationStore, sessionStore, widgetStore, mainStore, leaveMeetingSpace} = useStore();
  const {calendarStore, space} = collaborationStore;
  const {favoriteStore} = mainStore;
  const {eventListStore, formDialog, magicDialog, deleteConfirmationDialog} = calendarStore;
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
    if (space) {
      calendarStore.showMagicLink(space.id, eventId);
    }
  };

  const handleEventDelete = async () => {
    if (space) {
      if (await calendarStore.removeEvent(space.id)) {
        toast.info(
          <ToastContent
            headerIconName="calendar"
            title={t('titles.alert')}
            text={t('messages.removeEventSuccess')}
            isCloseButton
          />
        );
      } else {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="calendar"
            title={t('titles.alert')}
            text={t('errors.couldNotRemoveEvent')}
            isCloseButton
          />
        );
      }
    }
  };

  useEffect(() => {
    if (space) {
      eventListStore.fetchEvents(space.id);
    }

    return () => eventListStore.resetModel();
  }, [eventListStore, space]);

  if (!space) {
    return null;
  }

  return (
    <styled.Container data-testid="CalendarPage-test">
      <SpaceTopBar
        title={space.name ?? ''}
        subtitle="calendar"
        isAdmin={space.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={favoriteStore.isFavorite(space.id || '')}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        isChat={false}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
      >
        {space.isAdmin && (
          <Button variant="primary" label="Add Gathering" theme={theme} onClick={handleEventForm} />
        )}
      </SpaceTopBar>
      <styled.InnerContainer>
        <EventList
          currentUserId={sessionStore.userId}
          events={eventListStore.events}
          onMagicLinkOpen={handleMagicLinkOpen}
          isLoading={eventListStore.areEventsLoading}
          onEventEdit={space.isAdmin ? calendarStore.editEvent : undefined}
          onEventRemove={space.isAdmin ? calendarStore.selectEventToRemove : undefined}
          onWeblinkClick={handleWeblink}
          onShowAttendeesList={attendeesListStore.showAttendees}
        />
      </styled.InnerContainer>
      {calendarStore.formDialog.isOpen && <EventForm />}

      {calendarStore.magicId && magicDialog.isOpen && (
        <LinkDialog
          title={t('eventList.eventItem.magicLinkDialog.title')}
          copyLabel={t('eventList.eventItem.magicLinkDialog.copyLabel')}
          link={`${window.location.protocol}//${window.location.host}/magic/${calendarStore.magicId}`}
          onClose={magicDialog.close}
        />
      )}

      {deleteConfirmationDialog.isOpen && (
        <DeleteEventConfirmationDialog
          onConfirmation={handleEventDelete}
          onClose={deleteConfirmationDialog.close}
        />
      )}
    </styled.Container>
  );
};

export default observer(CalendarPage);
