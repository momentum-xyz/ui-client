import React, {FC, useEffect} from 'react';
import {toast} from 'react-toastify';
import {PanelLayout} from '@momentum-xyz/ui-kit';
import {absoluteLink, useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EventList, DeleteEventDialog, ToastContent} from 'ui-kit';

import * as styled from './CalendarWidget.styled';
import {EventForm, TabBarButtons} from './components';

const CalendarWidget: FC = () => {
  const {widgetsStore, universeStore, sessionStore} = useStore();
  const {world3dStore, world2dStore} = universeStore;
  const {calendarStore} = widgetsStore;
  const {eventList, deleteConfirmationDialog} = calendarStore;

  const {t} = useI18n();

  useEffect(() => {
    eventList.fetchSpaceEvents(universeStore.worldId);
    world3dStore?.changeKeyboardControl(false);

    return () => {
      world3dStore?.changeKeyboardControl(true);
      eventList.resetModel();
    };
  }, [calendarStore, eventList, world3dStore, universeStore.worldId]);

  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleEventDelete = async () => {
    if (universeStore.worldId) {
      if (await calendarStore.removeEvent(universeStore.worldId)) {
        toast.info(
          <ToastContent
            icon="calendar"
            title={t('titles.alert')}
            text={t('messages.removeEventSuccess')}
            showCloseButton
          />
        );
      } else {
        toast.error(
          <ToastContent
            isDanger
            icon="calendar"
            title={t('titles.alert')}
            text={t('errors.couldNotRemoveEvent')}
            showCloseButton
          />
        );
      }
    }
  };

  return (
    <styled.Modal data-testid="CalendarWidget-test">
      <styled.Container className="noScrollIndicator">
        <PanelLayout
          componentSize={{width: '1063px'}}
          onClose={calendarStore.dialog.close}
          title={world2dStore?.info?.name}
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
              disabled={!world2dStore?.isMyWorld || false}
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
