import React, {FC, useEffect} from 'react';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';
import {PanelLayout} from '@momentum-xyz/ui-kit';
import {absoluteLink, useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EventList, DeleteEventDialog, ToastContent} from 'ui-kit';

import * as styled from './CalendarWidget.styled';
import {EventForm, TabBarButtons} from './components';

const CalendarWidget: FC = () => {
  const {widgetsStore, universeStore, sessionStore} = useStore();
  const {instance3DStore, activeWorldStore} = universeStore;
  const {calendarStore} = widgetsStore;
  const {eventList, deleteConfirmationDialog} = calendarStore;

  const {t} = useI18n();
  const theme = useTheme();

  useEffect(() => {
    eventList.fetchSpaceEvents(universeStore.worldId);
    instance3DStore.changeKeyboardControl(false);

    return () => {
      instance3DStore.changeKeyboardControl(true);
      eventList.resetModel();
    };
  }, [calendarStore, eventList, instance3DStore, universeStore.worldId]);

  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleEventDelete = async () => {
    if (universeStore.worldId) {
      if (await calendarStore.removeEvent(universeStore.worldId)) {
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
          title={activeWorldStore.info?.name}
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
              disabled={!activeWorldStore.isMyWorld}
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
