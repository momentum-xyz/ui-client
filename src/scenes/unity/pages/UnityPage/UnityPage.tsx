import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';
import {generatePath, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import Unity from 'react-unity-webgl';

import {ROUTES} from 'core/constants';
import {useStore, usePosBusEvent, useUnityEvent} from 'shared/hooks';
import {HighFiveContent, Portal, TOAST_BASE_OPTIONS, ToastContent, UnityLoader} from 'ui-kit';

import * as styled from './UnityPage.styled';

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

const UnityPage: FC = () => {
  const {mainStore, unityLoaded} = useStore();
  const {unityStore} = mainStore;

  const auth = useAuth();
  const theme = useTheme();
  const history = useHistory();
  const {t} = useTranslation();

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

  useUnityEvent('ClickEventDashboard', (spaceId: string) => {
    history.push({pathname: generatePath(ROUTES.collaboration.dashboard, {spaceId})});
  });

  useUnityEvent('PlasmaClickEvent', (spaceId: string) => {
    history.push({pathname: generatePath(ROUTES.collaboration.dashboard, {spaceId})});
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
