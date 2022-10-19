import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';
import {generatePath, useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import Unity from 'react-unity-webgl';
import {Portal} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {useStore, usePosBusEvent, useUnityEvent} from 'shared/hooks';
import {
  UnityLoader,
  ToastContent,
  HighFiveContent,
  InviteToSpaceContent,
  TOAST_BASE_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';

import {PathObserver} from './components';
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
  const location = useLocation();
  const {t} = useTranslation();

  useUnityEvent('MomentumLoaded', () => {
    unityStore.setAuthToken(auth.user?.access_token);
    unityStore.setInitialVolume();
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
    document.location.href = ROUTES.system.disconnected;
  });

  useUnityEvent('ClickEventDashboard', (spaceId: string) => {
    history.push({pathname: generatePath(ROUTES.collaboration.dashboard, {spaceId})});
  });

  useUnityEvent('PlasmaClickEvent', (spaceId: string) => {
    history.push({pathname: generatePath(ROUTES.collaboration.dashboard, {spaceId})});
  });

  useUnityEvent('ClickEventVideo', (spaceId: string) => {
    history.push({pathname: generatePath(ROUTES.video, {spaceId})});
  });

  usePosBusEvent('space-invite', async (spaceId, invitorId, invitorName, uiTypeId) => {
    console.info('[POSBUS EVENT] space-invite', spaceId, invitorId, invitorName, uiTypeId);
    // FIXME: Temporary solution. To get space name from Unity
    const spaceName = await unityStore.fetchSpaceName(spaceId);

    const handleJoinSpace = () => {
      unityStore.teleportToSpace(spaceId);

      setTimeout(() => {
        history.push({pathname: generatePath(ROUTES.collaboration.dashboard, {spaceId})});
      }, TELEPORT_DELAY_MS);
    };

    const handleJoinTable = () => {
      history.push({pathname: generatePath(ROUTES.grabTable, {spaceId})});
    };

    toast.info(
      <InviteToSpaceContent
        invitorName={invitorName}
        spaceName={spaceName}
        joinToSpace={uiTypeId === appVariables.GAT_UI_TYPE_ID ? handleJoinTable : handleJoinSpace}
      />,
      TOAST_NOT_AUTO_CLOSE_OPTIONS
    );
  });

  usePosBusEvent('high-five', (senderId, message) => {
    console.info('[POSBUS EVENT] high-five', senderId, message);
    toast.info(
      <HighFiveContent
        message={message}
        sendBack={() => {
          unityStore.sendHighFiveBack(senderId);
        }}
        showCloseButton
      />,
      TOAST_BASE_OPTIONS
    );
  });

  usePosBusEvent('high-five-sent', (message) => {
    console.info('[POSBUS EVENT] high-five-sent', message);
    toast.info(
      <ToastContent
        headerIconName="check"
        title={t('messages.highFiveSentTitle', {name: message})}
        text={t('messages.highFiveSentText')}
        showCloseButton
      />
    );
  });

  usePosBusEvent('notify-gathering-start', (message) => {
    console.info('[POSBUS EVENT] notify-gathering-start', message);
    const {spaceId} = message;
    const alreadyInSpace: boolean = location.pathname.includes(
      generatePath(ROUTES.collaboration.base, {spaceId})
    );

    const handleJoinSpace = () => {
      unityStore.teleportToSpace(spaceId);

      setTimeout(() => {
        history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
      }, TELEPORT_DELAY_MS);
    };

    toast.info(
      <ToastContent
        headerIconName="calendar"
        title={t('titles.joinGathering')}
        text={t('messages.joinGathering', {title: message.name})}
        approveInfo={{
          title: alreadyInSpace ? t('actions.dismiss') : t('actions.join'),
          onClick: alreadyInSpace ? undefined : handleJoinSpace
        }}
        showCloseButton
      />,
      TOAST_NOT_AUTO_CLOSE_OPTIONS
    );
  });

  usePosBusEvent('simple-notification', (message) => {
    console.info('[POSBUS EVENT] simple-notification', message);
    toast.info(
      <ToastContent
        headerIconName="check"
        title={t('titles.alert')}
        text={message}
        showCloseButton
      />
    );
  });

  if (!unityStore.unityContext) {
    return <></>;
  }

  return (
    <Portal>
      <styled.Inner data-testid="UnityPage-test">
        <Unity unityContext={unityStore.unityContext} style={UnityContextCSS} />
      </styled.Inner>
      <PathObserver
        isTeleportReady={unityStore.isTeleportReady}
        resumeUnity={unityStore.resume}
        pauseUnity={unityStore.pause}
      />
      {!unityStore.isTeleportReady && <UnityLoader theme={theme} />}
    </Portal>
  );
};

export default observer(UnityPage);
