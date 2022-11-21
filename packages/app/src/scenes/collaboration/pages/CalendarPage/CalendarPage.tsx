import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {t} from 'i18next';
import {toast} from 'react-toastify';
import {useHistory} from 'react-router';
import {Button, SpacePage, SpaceTopBar} from '@momentum-xyz/ui-kit';
import {absoluteLink} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {EventList, LinkDialog, ToastContent, DeleteEventDialog} from 'ui-kit';

import {EventForm} from './components';
import * as styled from './CalendarPage.styled';

const CalendarPage: FC = () => {
  const {collaborationStore, sessionStore, mainStore, leaveMeetingSpace} = useStore();
  const {calendarStore, spaceStore} = collaborationStore;
  const {eventList, formDialog, magicDialog, deleteConfirmationDialog, magicLink} = calendarStore;
  const {favoriteStore, unityStore} = mainStore;
  const {space} = spaceStore;

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
    if (space) {
      eventList.fetchEvents(space.id);
    }

    return () => eventList.resetModel();
  }, [eventList, space]);

  const handleFlyToSpace = (spaceId: string) => {
    unityStore.teleportToSpace(spaceId);
    history.push(ROUTES.base);
  };

  if (!space) {
    return null;
  }

  return (
    <SpacePage dataTestId="CalendarPage-test">
      <SpaceTopBar
        title={space.name}
        subtitle="calendar"
        isAdmin={spaceStore.isAdmin}
        spaceId={spaceStore.id}
        isSpaceFavorite={favoriteStore.isFavorite(space.id)}
        toggleIsSpaceFavorite={favoriteStore.toggleFavorite}
        editSpaceHidden
        showChatButton={false}
        onLeave={async () => {
          await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
        adminLink={generatePath(ROUTES.spaceAdmin.base, {spaceId: space.id})}
        baseLink={generatePath(ROUTES.base, {spaceId: space.id})}
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
          onFlyToSpace={handleFlyToSpace}
          canManageInSpace={spaceStore.isAdmin}
        />
      </styled.InnerContainer>
      {calendarStore.formDialog.isOpen && <EventForm />}

      {magicDialog.isOpen && (
        <LinkDialog
          theme={theme}
          title={t('eventList.eventItem.magicLinkDialog.title')}
          copyLabel={t('eventList.eventItem.magicLinkDialog.copyLabel')}
          link={magicLink}
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
