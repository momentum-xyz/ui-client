import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';
import {PanelLayout} from '@momentum-xyz/ui-kit';
import {absoluteLink} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EventList, DeleteEventDialog, ToastContent} from 'ui-kit';

import * as styled from './CalendarWidget.styled';
import {EventForm, TabBarButtons} from './components';

const CalendarWidget: FC = () => {
  const {widgetsStore, unityStore, sessionStore} = useStore();
  const {unityInstanceStore, unityWorldStore} = unityStore;
  const {calendarStore} = widgetsStore;
  const {eventList, deleteConfirmationDialog} = calendarStore;

  const {t} = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    eventList.fetchSpaceEvents(unityStore.worldId);
    unityInstanceStore.changeKeyboardControl(false);

    return () => {
      unityInstanceStore.changeKeyboardControl(true);
      eventList.resetModel();
    };
  }, [calendarStore, eventList, unityInstanceStore, unityStore.worldId]);

  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleEventDelete = async () => {
    if (unityStore.worldId) {
      if (await calendarStore.removeEvent(unityStore.worldId)) {
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
    <styled.Modal theme={theme} data-testid="CalendarWidget-test">
      <styled.Container className="noScrollIndicator">
        <PanelLayout
          componentSize={{width: '1063px'}}
          onClose={calendarStore.dialog.close}
          title={unityWorldStore.world?.name}
          headerStyle="uppercase"
          headerType="h2"
          headerIconName="calendar"
          subtitle={t('calendar.subTitle')}
          iconSize="medium-large"
          closeButtonSize="medium-large"
          tabs={<TabBarButtons calendar="odyssey" />}
        >
          <styled.InnerContainer>
            <styled.FormButton
              disabled={!unityWorldStore.isMyWorld}
              label={t('calendar.formButton')}
              variant="primary"
              height="medium-height"
              transform="capitalized"
              onClick={calendarStore.formDialog.open}
            />
            <EventList
              user={sessionStore.user ?? undefined}
              events={eventList.events}
              onEventEdit={calendarStore.editEvent}
              onEventRemove={calendarStore.selectEventToRemove}
              onWeblinkClick={handleWeblink}
            />
          </styled.InnerContainer>
        </PanelLayout>

        {calendarStore.formDialog.isOpen && <EventForm />}

        {deleteConfirmationDialog.isOpen && (
          <DeleteEventDialog
            onConfirmation={handleEventDelete}
            onClose={deleteConfirmationDialog.close}
          />
        )}
      </styled.Container>
    </styled.Modal>
  );
};

export default observer(CalendarWidget);
