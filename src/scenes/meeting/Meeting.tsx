import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {TOAST_COMMON_OPTIONS, TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {StageModePIPWidget} from 'scenes/widgets/pages';

import {MeetingRoomPage} from './pages';
import * as styled from './Meeting.styled';

const Meeting: FC = () => {
  const {mainStore, sessionStore, meetingStore} = useStore();
  const {agoraStore} = mainStore;
  const {agoraMeetingStore, userDevicesStore} = agoraStore;

  const {t} = useTranslation();
  const history = useHistory();

  usePosBusEvent('meeting-mute', () => {
    userDevicesStore.mute();
  });

  usePosBusEvent('meeting-mute-all', (moderatorId) => {
    if (sessionStore.userId !== moderatorId) {
      userDevicesStore.mute();
    }
  });

  usePosBusEvent('meeting-kick', async (spaceId) => {
    meetingStore.setKicked(true);
    history.push(ROUTES.base);

    toast.info(
      <ToastContent
        headerIconName="logout"
        title={t('titles.kickedFromMeeting')}
        text={t('messages.kickedFromMeeting')}
        isCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );
  });

  usePosBusEvent('stage-mode-mute', () => {
    userDevicesStore.mute();

    toast.info(
      <ToastContent
        headerIconName="alert"
        title={t('titles.alert')}
        text={t('messages.stageModeMuted')}
        isCloseButton
      />,
      TOAST_GROUND_OPTIONS
    );
  });

  useEffect(() => {
    if (agoraMeetingStore.maxVideoStreamsReached) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.maximumParticipants')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  }, [agoraMeetingStore.maxVideoStreamsReached, t]);

  return (
    <styled.Container>
      <MeetingRoomPage />
      {!history.location.pathname.includes('stage-mode') && <StageModePIPWidget />}
    </styled.Container>
  );
};

export default observer(Meeting);
