import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useAuth} from 'react-oidc-context';
import {useTheme} from 'styled-components';
import {generatePath, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import Unity from 'react-unity-webgl';

import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {useStore, usePosBusEvent, useUnityEvent} from 'shared/hooks';
import {
  Portal,
  UnityLoader,
  ToastContent,
  HighFiveContent,
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
    history.push({pathname: generatePath(ROUTES.disconnect)});
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

  // TODO: Refactor GAT
  usePosBusEvent('space-invite', (spaceId, invitorId, invitorName, uiTypeId) => {
    const handleJoinSpace = () => {
      unityStore.teleportToSpace(spaceId);

      // TODO: Refactoring
      /*collaborationStore
        .joinMeetingSpace(spaceId, uiTypeId === appVariables.GAT_UI_TYPE_ID)
        .then(() => {
          if (uiTypeId !== appVariables.GAT_UI_TYPE_ID) {
            history.push({pathname: ROUTES.collaboration.base, state: {spaceId}});
          } else {
            history.push({pathname: ROUTES.collaboration.table, state: {spaceId}});
          }
        });*/
    };

    const Content: React.FC = () => {
      //const [spaceInfo, , ,] = useGetSpace(spaceId);

      return (
        <ToastContent
          headerIconName="alert"
          text={t('messages.joinSpaceWelcome')}
          title={t('messages.spaceInvitationNote', {
            invitor: invitorName,
            spaceName: '' //spaceInfo?.space.name
          })}
          approveInfo={{title: t('titles.joinSpace'), onClick: handleJoinSpace}}
        />
      );
    };

    toast.info(<Content />, TOAST_BASE_OPTIONS);
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
        title={t('messages.highFiveSentTitle', {name: message})}
        text={t('messages.highFiveSentText')}
        isCloseButton
      />
    );
  });

  usePosBusEvent('notify-gathering-start', (message) => {
    const handleJoinSpace = () => {
      const {spaceId} = message;
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
        approveInfo={{title: 'Join', onClick: handleJoinSpace}}
      />,
      TOAST_NOT_AUTO_CLOSE_OPTIONS
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
