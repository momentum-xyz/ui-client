import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useParams} from 'react-router-dom';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {PosBusEventEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';
import {Button, TopBar, EventList, LinkDialog, ToastContent} from 'ui-kit';
import useCollaboration, {
  useLeaveCollaborationSpace
} from 'context/Collaboration/hooks/useCollaboration';
import {useStageModeLeave} from 'hooks/api/useStageModeService';
import {absoluteLink} from 'core/utils';

import * as styled from './CalendarPage.styled';
import {DeleteEventConfirmationDialog, EventForm} from './components';

const CalendarPage: FC = () => {
  const {
    collaborationStore,
    sessionStore,
    widgetStore: {attendeesListStore}
  } = useStore();
  const {calendarStore, space} = collaborationStore;
  const theme = useTheme();
  const {eventListStore, formDialog, magicDialog, deleteConfirmationDialog} = calendarStore;

  const {eventId} = useParams<{eventId: string}>();

  // TODO: Refactor legacy hooks to mobx
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);

  // TODO: make as action in store
  const leaveCollaborationSpace = () => {
    if (collaborationState.collaborationSpace) {
      UnityService.triggerInteractionMsg?.(
        PosBusEventEnum.LeftSpace,
        collaborationState.collaborationSpace.id,
        0,
        ''
      );
      leaveCollaborationSpaceCall(false).then(stageModeLeave);

      if (collaborationState.stageMode) {
        collaborationDispatch({
          type: 'COLLABORATION_STAGE_MODE_ACTION_UPDATE',
          stageMode: false
        });
      }
    }
  };
  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleEventForm = () => {
    formDialog.open();
  };
  // TODO , move to Calendar world page

  const handleMagicLinkOpen = (eventId: string) => {
    if (!space.id) {
      return;
    }

    calendarStore.showMagicLink(space.id, eventId);
  };

  const handleEventDelete = async () => {
    if (space.id) {
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
    if (space.id) {
      eventListStore.fetchEvents(space.id);
    }

    return () => eventListStore.resetModel();
  }, [space.id]);

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
      {deleteConfirmationDialog.isOpen && (
        <DeleteEventConfirmationDialog
          onConfirmation={() => {
            handleEventDelete();
          }}
          onClose={deleteConfirmationDialog.close}
        />
      )}
      <TopBar title={space.name ?? ''} subtitle="calendar" onClose={leaveCollaborationSpace}>
        {space.isAdmin && (
          <Button variant="primary" label="Add Gathering" theme={theme} onClick={handleEventForm} />
        )}
      </TopBar>
      <EventList
        currentUserId={sessionStore.userId}
        events={eventListStore.events}
        selectedEventId={eventId}
        onMagicLinkOpen={handleMagicLinkOpen}
        isLoading={eventListStore.areEventsLoading}
        onEventEdit={space.isAdmin ? calendarStore.editEvent : undefined}
        onEventRemove={space.isAdmin ? calendarStore.selectEventToRemove : undefined}
        onWeblinkClick={handleWeblink}
        onShowAttendeesList={attendeesListStore.showAttendees}
      />
      {calendarStore.formDialog.isOpen && <EventForm />}
    </styled.Container>
  );
};

export default observer(CalendarPage);
