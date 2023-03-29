import React, {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
// import {useTheme} from 'styled-components';
import {generatePath, matchPath, useNavigate, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
// import Unity from 'react-unity-webgl';
import {Portal} from '@momentum-xyz/ui-kit';
import {BabylonScene} from '@momentum-xyz/odyssey3d';
import {Event3dEmitter, useI18n} from '@momentum-xyz/core';

import {PRIVATE_ROUTES_WITH_UNITY} from 'scenes/App.routes';
import {appVariables} from 'api/constants';
import {ROUTES} from 'core/constants';
import {useStore, usePosBusEvent, useUnityEvent} from 'shared/hooks';
import {
  // UnityLoader,
  ToastContent,
  HighFiveContent,
  TOAST_BASE_OPTIONS,
  TOAST_COMMON_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';
import {PosBusService} from 'shared/services';

import * as styled from './UnityPage.styled';

// const UnityContextCSS = {
//   width: '100vw',
//   height: '100vh'
// };

const UnityPage: FC = () => {
  const {universeStore, sessionStore, widgetsStore} = useStore();
  const {instance3DStore} = universeStore;

  // const theme = useTheme();
  const navigate = useNavigate();
  const {t} = useI18n();
  const location = useLocation();

  // useEffect(() => {
  //   instance3DStore.init();
  // }, [instance3DStore]);

  // TODO: FIXME
  const worldId = useMemo(() => {
    const paths: string[] = PRIVATE_ROUTES_WITH_UNITY.map((route) => route.path);

    let worldId = '';
    paths.forEach((path) => {
      const match = matchPath({path: path, end: false}, location.pathname);
      // const match = matchPath<{worldId: string}>({path: path}, location.pathname);
      if (match?.params?.worldId) {
        worldId = match.params.worldId;
      }
    });

    return worldId;
  }, [location.pathname]);

  useEffect(() => {
    if (worldId) {
      const setWorld = () => {
        if (!PosBusService.isConnected()) {
          console.log(`PosBusService is not connected.`);
          setTimeout(() => {
            setWorld();
          }, 1000);
          return;
        }
        console.log(`Posbus - Set worldId: ${worldId}`);
        PosBusService.setWorld(worldId);
      };
      setWorld();
    }
  }, [worldId]);

  useUnityEvent('MomentumLoaded', async () => {
    console.log(`Unity worldId: ${worldId}`);

    if (worldId) {
      await instance3DStore.loadWorldById(worldId, sessionStore.token);
    } else {
      console.error(`There is no worldId in route.`);
    }
  });

  useUnityEvent('TeleportReady', () => {
    const worldId = instance3DStore.getCurrentWorld();
    if (worldId) {
      universeStore.initTeleport(worldId);
    }
  });

  useUnityEvent('Error', (message: string) => {
    console.info('Unity Error handling', message);
  });

  useUnityEvent('ExterminateUnity', () => {
    document.location.href = ROUTES.system.disconnected;
  });

  useUnityEvent('ClickObjectEvent', (spaceId: string, label: string) => {
    if (label === 'portal_odyssey') {
      widgetsStore.odysseyInfoStore.open(appVariables.ODYSSEY_WORLD_ID);
      return;
    }
    navigate({
      pathname: generatePath(ROUTES.odyssey.object.root, {
        worldId: universeStore.worldId,
        objectId: spaceId
      })
    });
  });

  useUnityEvent('EditObjectEvent', (spaceId: string) => {
    console.log('EditObjectEvent', spaceId);
    navigate(generatePath(ROUTES.odyssey.creator.base, {worldId: universeStore.worldId}));
    setTimeout(() => {
      // This even comes faster than actual click, so delay
      instance3DStore.onUnityObjectClick(spaceId);
    }, 500);
  });

  useUnityEvent('ProfileClickEvent', (id: string) => {
    widgetsStore.odysseyInfoStore.open(id);
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
            onClick: () => instance3DStore.teleportToUser(userId)
          }}
        />,
        TOAST_NOT_AUTO_CLOSE_OPTIONS
      );
    }
  });

  // FIXME: FYI: It is not used anymore
  usePosBusEvent('space-invite', async (spaceId, invitorId, invitorName, uiTypeId) => {
    console.info('[POSBUS EVENT] space-invite', spaceId, invitorId, invitorName, uiTypeId);
  });

  usePosBusEvent('high-five', (senderId, message) => {
    console.info('[POSBUS EVENT] high-five', senderId, message);
    toast.info(
      <HighFiveContent
        message={message}
        sendBack={() => {
          instance3DStore.sendHighFiveBack(senderId);
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

  // if (!instance3DStore.unityContext) {
  //   return <></>;
  // }

  console.log('UnityPage render');

  return (
    <Portal>
      <styled.Inner
        data-testid="UnityPage-test"
        onClick={(event) => {
          instance3DStore.setLastClickPosition(event.clientX, event.clientY);
        }}
      >
        <BabylonScene
          events={Event3dEmitter}
          onMove={(e) => console.log('onMove', e)}
          onObjectClick={(e) => console.log('onObjectClick', e)}
          onObjectTransform={(objectId, transform) =>
            console.log('onObjectTransform', objectId, transform)
          }
          onUserClick={(e) => console.log('onUserClick', e)}
        />
        {/* <Unity unityContext={instance3DStore.unityContext} style={UnityContextCSS} /> */}
      </styled.Inner>

      {/* {!universeStore.isUnityAvailable && <UnityLoader theme={theme} />} */}
    </Portal>
  );
};

export default observer(UnityPage);
