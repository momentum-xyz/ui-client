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
import {EventList, LinkDialog, DeleteEventDialog, ToastContent} from 'ui-kit';

import * as styled from './OdysseyCalendarPage.styled';
import {TabBarButtons} from './components';

const OdysseyCalendarPage: FC = () => {
  const {worldCalendarStore, mainStore, sessionStore} = useStore();
  const {calendarStore} = worldCalendarStore;
  const {magicDialog, eventList, deleteConfirmationDialog, spaceId, magicLink} = calendarStore;
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

  // const handleEventForm = () => {
  //   calendarStore.formDialog.open();
  // };

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
              label="Create new event in your odyssey"
              variant="primary"
              height="medium-height"
            />
            <EventList
              user={sessionStore.user ?? undefined}
              events={eventList.events}
              isLoading={false}
              onEventEdit={calendarStore.editEvent}
              onEventRemove={calendarStore.selectEventToRemove}
              onWeblinkClick={handleWeblink}
              showOnWorldCalendar
            />
          </styled.InnerContainer>
        </PanelLayout>

        {magicDialog.isOpen && (
          <LinkDialog
            theme={theme}
            title={t('eventList.eventItem.magicLinkDialog.title')}
            copyLabel={t('eventList.eventItem.magicLinkDialog.copyLabel')}
            link={magicLink}
            onClose={magicDialog.close}
          />
        )}

        {/*{calendarStore.formDialog.isOpen && <EventForm />}*/}

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
