import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import Unity from 'react-unity-webgl';

import {ROUTES} from 'core/constants';
import {useStore, usePosBusEvent, useUnityEvent} from 'shared/hooks';
import {HighFiveContent, Portal, TOAST_BASE_OPTIONS, ToastContent, UnityLoader} from 'ui-kit';

// TODO: Refactoring
import {useJoinCollaborationSpaceByAssign} from '../../../../context/Collaboration/hooks/useCollaboration';

import * as styled from './UnityPage.styled';

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

const UnityPage: FC = () => {
  const {mainStore, unityLoaded, collaborationStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {unityStore} = mainStore;

  const auth = useAuth();
  const theme = useTheme();
  const history = useHistory();
  const {t} = useTranslation();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();

  useUnityEvent('MomentumLoaded', () => {
    unityStore.setAuthToken(auth.user?.access_token);
  });

  useUnityEvent('TeleportReady', () => {
    const worldId = unityStore.getCurrentWorld();
    if (worldId) {
      unityLoaded(worldId);
    }
  });

  useUnityEvent('Error', (message: string) => {
    console.info('Unity Error handling', message);
  });

  useUnityEvent('ExterminateUnity', () => {
    window.location.href = '/disconnect.html';
  });

  useUnityEvent('ClickEventDashboard', async (spaceId: string) => {
    if (await spaceStore.canUserJoin(spaceId)) {
      await joinMeetingSpace(spaceId);
      history.push({pathname: ROUTES.dashboard});
    } else {
      toast.error(
        <ToastContent
          isDanger
          isCloseButton
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('collaboration.spaceIsPrivate')}
        />
      );
    }
  });

  useUnityEvent('PlasmaClickEvent', async (spaceId: string) => {
    if (await spaceStore.canUserJoin(spaceId)) {
      await joinMeetingSpace(spaceId);
      history.push({pathname: ROUTES.collaboration});
    } else {
      toast.error(
        <ToastContent
          isDanger
          isCloseButton
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('collaboration.spaceIsPrivate')}
        />
      );
    }
  });

  usePosBusEvent('high-five', (senderId, message) => {
    toast.info(
      <HighFiveContent
        message={message}
        sendBack={() => {
          unityStore.sendHighFiveBack(senderId);
        }}
      />,
      TOAST_BASE_OPTIONS
    );
  });

  usePosBusEvent('high-five-sent', (message) => {
    toast.info(
      <ToastContent
        headerIconName="check"
        title={t('messages.highFiveSentTitle', {
          name: message
        })}
        text={t('messages.highFiveSentText')}
        isCloseButton
      />
    );
  });

  usePosBusEvent('simple-notification', (message) => {
    toast.info(
      <ToastContent headerIconName="check" title={t('titles.alert')} text={message} isCloseButton />
    );
  });

  if (!unityStore.unityContext) {
    return <></>;
  }

  return (
    <Portal>
      <styled.Inner>
        <Unity unityContext={unityStore.unityContext} style={UnityContextCSS} />
      </styled.Inner>
      {!unityStore.isTeleportReady && <UnityLoader theme={theme} />}
    </Portal>
  );
};

export default observer(UnityPage);
