import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {StageModePIPWidget} from 'scenes/widgets/pages';

import {MeetingRoomPage} from './pages';

const Meeting: FC = () => {
  const {mainStore, sessionStore} = useStore();
  const {agoraStore} = mainStore;
  const {userDevicesStore} = agoraStore;

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
    if (agoraStore.maxVideoStreamsReached) {
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
  }, [agoraStore.maxVideoStreamsReached, t]);

  return (
    <>
      <MeetingRoomPage />
      {!history.location.pathname.includes('stage-mode') && <StageModePIPWidget />}
    </>
  );
};

export default observer(Meeting);
