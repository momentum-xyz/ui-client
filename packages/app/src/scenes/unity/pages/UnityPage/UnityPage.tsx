import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {generatePath, matchPath, useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import Unity from 'react-unity-webgl';
import {Portal, UserStatusEnum} from '@momentum-xyz/ui-kit';

import {PRIVATE_ROUTES_WITH_UNITY} from 'scenes/App.routes';
import {appVariables} from 'api/constants';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {useStore, usePosBusEvent, useUnityEvent} from 'shared/hooks';
import {
  UnityLoader,
  ToastContent,
  HighFiveContent,
  InvitationContent,
  TOAST_BASE_OPTIONS,
  TOAST_COMMON_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';

import * as styled from './UnityPage.styled';
import {ObjectMenu} from './components';

const UnityContextCSS = {
  width: '100vw',
  height: '100vh'
};

const UnityPage: FC = () => {
  const {unityStore, sessionStore, odysseyCreatorStore: worldBuilderStore} = useStore();
  const {objectFunctionalityStore: worldBuilderObjectStore} = worldBuilderStore;
  const {unityInstanceStore} = unityStore;

  const theme = useTheme();
  const history = useHistory();
  const {t} = useTranslation();
  const location = useLocation();

  // TODO: FIXME
  const worldId = useMemo(() => {
    const paths: string[] = PRIVATE_ROUTES_WITH_UNITY.map((route) => route.path);

    let worldId = '';
    paths.forEach((path) => {
      const match = matchPath<{worldId: string}>(location.pathname, {path: path});
      if (match?.params?.worldId) {
        worldId = match.params.worldId;
      }
    });

    return worldId;
  }, [location.pathname]);

  useUnityEvent('MomentumLoaded', async () => {
    console.log(`Unity worldId: ${worldId}`);

    if (worldId) {
      await unityInstanceStore.loadWorldById(worldId, sessionStore.token);
    } else {
      console.error(`There is no worldId in route.`);
    }
  });

  useUnityEvent('TeleportReady', () => {
    const worldId = unityInstanceStore.getCurrentWorld();
    if (worldId) {
      unityStore.initTeleport(worldId);
    }
  });

  useUnityEvent('Error', (message: string) => {
    console.info('Unity Error handling', message);
  });

  useUnityEvent('ExterminateUnity', () => {
    document.location.href = ROUTES.system.disconnected;
  });

  useUnityEvent('ClickObjectEvent', (spaceId: string) => {
    history.push({
      pathname: generatePath(ROUTES.odyssey.object.root, {
        worldId: unityStore.worldId,
        objectId: spaceId
      })
    });
  });

  useUnityEvent('EditObjectEvent', (spaceId: string) => {
    console.log('EditObjectEvent', spaceId);
    // This even comes faster than actual click, so delay
    setTimeout(() => unityInstanceStore.onUnityObjectClick(spaceId), 500);
  });

  usePosBusEvent('fly-to-me', (spaceId, userId, userName) => {
    if (sessionStore.userId === userId) {
      toast.info(
        <ToastContent
          headerIconName="fly-with-me"
          title="Fly to me Request"
          text="Your request was sent!"
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.info(
        <ToastContent
          headerIconName="fly-with-me"
          title="Fly to me Request"
          text={`${userName} has invited you to fly to them`}
          declineInfo={{title: t('actions.decline')}}
          approveInfo={{
            title: t('actions.join'),
            onClick: () => unityInstanceStore.teleportToUser(userId)
          }}
        />,
        TOAST_NOT_AUTO_CLOSE_OPTIONS
      );
    }
  });

  usePosBusEvent('space-invite', async (spaceId, invitorId, invitorName, uiTypeId) => {
    console.info('[POSBUS EVENT] space-invite', spaceId, invitorId, invitorName, uiTypeId);
    // FIXME: Temporary solution. To get space name from Unity
    const spaceName = await unityInstanceStore.fetchSpaceName(spaceId);

    // TODO: Remove this after UserController will send profile changes
    const isTable = uiTypeId === appVariables.GAT_UI_TYPE_ID;
    if (isTable && sessionStore.user?.status === UserStatusEnum.DO_NOT_DISTURB) {
      return;
    }

    const handleJoinSpace = () => {
      unityInstanceStore.teleportToSpace(spaceId);

      setTimeout(() => {
        history.push({pathname: generatePath(ROUTES.collaboration.dashboard, {spaceId})});
      }, TELEPORT_DELAY_MS);
    };

    const handleJoinTable = () => {
      history.push({pathname: generatePath(ROUTES.grabTable, {spaceId})});
    };

    toast.info(
      <InvitationContent
        invitorName={invitorName}
        spaceName={spaceName}
        join={isTable ? handleJoinTable : handleJoinSpace}
        isTable={isTable}
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
          unityInstanceStore.sendHighFiveBack(senderId);
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

    toast.info(
      <ToastContent
        headerIconName="calendar"
        title={t('titles.joinGathering')}
        text={t('messages.joinGathering', {title: message.title})}
        approveInfo={{
          title: t('actions.dismiss')
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

  if (!unityInstanceStore.unityContext) {
    return <></>;
  }

  return (
    <Portal>
      <styled.Inner
        data-testid="UnityPage-test"
        onClick={(event) => {
          unityInstanceStore.handleClick(event.clientX, event.clientY);
        }}
      >
        <Unity unityContext={unityInstanceStore.unityContext} style={UnityContextCSS} />
      </styled.Inner>

      {unityInstanceStore.objectMenu.isOpen && (
        <ObjectMenu
          gizmoType={unityInstanceStore.gizmoMode}
          worldId={unityStore.worldId}
          position={unityInstanceStore.objectMenuPosition}
          objectId={unityInstanceStore.selectedObjectId ?? ' '}
          onGizmoTypeChange={unityInstanceStore.changeGizmoType}
          onObjectRemove={() => {
            worldBuilderObjectStore.deleteObject();
            unityInstanceStore.objectMenu.close();
          }}
          onUndo={unityInstanceStore.undo}
          onRedo={unityInstanceStore.redo}
        />
      )}

      {!unityStore.isUnityAvailable && <UnityLoader theme={theme} />}
    </Portal>
  );
};

export default observer(UnityPage);
