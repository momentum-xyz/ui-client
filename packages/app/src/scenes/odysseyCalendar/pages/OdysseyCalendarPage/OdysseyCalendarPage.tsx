import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';
import {PanelLayout} from '@momentum-xyz/ui-kit';
import {absoluteLink} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {EventList, DeleteEventDialog, ToastContent} from 'ui-kit';

import * as styled from './OdysseyCalendarPage.styled';
import {EventForm, TabBarButtons} from './components';

const OdysseyCalendarPage: FC = () => {
  const {calendarStore, mainStore, sessionStore} = useStore();
  const {odysseyCalendarStore} = calendarStore;
  const {eventList, deleteConfirmationDialog} = odysseyCalendarStore;
  const {worldStore} = mainStore;

  const {t} = useTranslation();
  const history = useHistory();
  const theme = useTheme();

  useEffect(() => {
    eventList.fetchSpaceEvents(worldStore.worldId);

    return () => {
      eventList.resetModel();
    };
  }, [eventList, worldStore.worldId]);

  const handleWeblink = (weblink: string) => {
    window.open(absoluteLink(weblink), '_blank');
  };

  const handleEventDelete = async () => {
    if (worldStore.worldId) {
      if (await odysseyCalendarStore.removeEvent(worldStore.worldId)) {
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
    <styled.Modal theme={theme} data-testid="OdysseyCalendarPage-test">
      <styled.Container className="noScrollIndicator">
        <PanelLayout
          componentSize={{width: '70vw'}}
          onClose={handleClose}
          title="OdysseyName"
          headerStyle="uppercase"
          headerType="h2"
          headerIconName="calendar"
          subtitle="Calendar"
          iconSize="medium-large"
          closeButtonSize="large"
          tabs={<TabBarButtons calendar="odyssey" />}
        >
          <styled.InnerContainer>
            <styled.FormButton
              label="Create new event in your Odyssey"
              variant="primary"
              height="medium-height"
              transform="capitalized"
              onClick={odysseyCalendarStore.formDialog.open}
            />
            <EventList
              user={sessionStore.user ?? undefined}
              events={eventList.events}
              isLoading={false}
              onEventEdit={odysseyCalendarStore.editEvent}
              onEventRemove={odysseyCalendarStore.selectEventToRemove}
              onWeblinkClick={handleWeblink}
              showOnWorldCalendar
            />
          </styled.InnerContainer>
        </PanelLayout>

        {odysseyCalendarStore.formDialog.isOpen && <EventForm />}

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

export default observer(OdysseyCalendarPage);
