import React, {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
// import {useTheme} from 'styled-components';
import {generatePath, matchPath, useNavigate, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useDebouncedCallback} from '@momentum-xyz/ui-kit-storybook';
import {BabylonScene} from '@momentum-xyz/odyssey3d';
import {
  ClickPositionInterface,
  Event3dEmitter,
  ObjectTransformInterface,
  TransformNoScaleInterface,
  useI18n
} from '@momentum-xyz/core';

import {WORLD_ROUTES} from 'scenes/App.routes';
// import {appVariables} from 'api/constants';
import {ROUTES} from 'core/constants';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {
  // UnityLoader,
  ToastContent,
  HighFiveContent,
  TOAST_BASE_OPTIONS
  // TOAST_COMMON_OPTIONS,
  // TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';
import {PosBusService} from 'shared/services';

import * as styled from './WorldPage.styled';

// const UnityContextCSS = {
//   width: '100vw',
//   height: '100vh'
// };

const WorldPage: FC = () => {
  const {universeStore, widgetsStore, widgetManagerStore} = useStore();
  const {world3dStore} = universeStore;

  // const theme = useTheme();
  const navigate = useNavigate();
  const {t} = useI18n();
  const location = useLocation();

  useEffect(() => {
    return () => {
      widgetManagerStore.closeAll();
    };
  }, [widgetManagerStore]);

  // useEffect(() => {
  //   instance3DStore.init();
  // }, [instance3DStore]);

  // TODO: FIXME
  const worldId = useMemo(() => {
    const paths: string[] = WORLD_ROUTES.map((route) => route.path);

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
      const teleportToWorld = () => {
        if (!PosBusService.isConnected()) {
          console.log(`BabylonPage: PosBusService is not connected.`);
          setTimeout(() => {
            teleportToWorld();
          }, 1000);
          return;
        }
        console.log(`BabylonPage: Posbus - Set worldId: ${worldId}`);
        PosBusService.teleportToWorld(worldId);
      };
      teleportToWorld();

      universeStore.enterWorld(worldId);
    }
    return () => {
      universeStore.leaveWorld();
    };
  }, [worldId, universeStore]);

  const handleObjectClick = (objectId: string, clickPos: ClickPositionInterface) => {
    if (universeStore.isCreatorMode) {
      console.log('BabylonPage: handle object click in creator mode', objectId);

      // TODO take coords from event
      // instance3DStore.setLastClickPosition

      navigate(generatePath(ROUTES.odyssey.creator.base, {worldId: universeStore.worldId}));

      world3dStore?.handleClick(objectId, clickPos);
    } else {
      console.log('BabylonPage: handle object click, NOT creator mode', objectId);
      // if (label === 'portal_odyssey') {
      //   widgetsStore.odysseyInfoStore.open(appVariables.ODYSSEY_WORLD_ID);
      //   return;
      // }
      navigate({
        pathname: generatePath(ROUTES.odyssey.object.root, {
          worldId: universeStore.worldId,
          objectId
        })
      });
    }
  };

  const handleClickOutside = () => {
    console.log('BabylonPage: handleClickOutside');
    world3dStore?.closeAndResetObjectMenu();
  };

  const handleUserClick = (id: string, clickPosition: ClickPositionInterface) => {
    console.log('BabylonPage: onUserClick', id);
    widgetsStore.odysseyInfoStore.open(id);
  };

  const handleUserMove = useDebouncedCallback(
    (transform: TransformNoScaleInterface) => {
      console.log('BabylonPage: onMove', transform);
      world3dStore?.handleUserMove(transform);
      PosBusService.sendMyTransform(transform); // move this to world3dStore??
    },
    250,
    [],
    {maxWait: 250}
  );

  const handleObjectTransform = useDebouncedCallback(
    (objectId: string, transform: ObjectTransformInterface) => {
      console.log('BabylonPage: onObjectTransform', objectId, transform);

      PosBusService.sendObjectTransform(objectId, transform);
    },
    250,
    [],
    {maxWait: 250}
  );

  // usePosBusEvent('fly-to-me', (spaceId, userId, userName) => {
  //   if (sessionStore.userId === userId) {
  //     toast.info(
  //       <ToastContent
  //         headerIconName="fly-with-me"
  //         title="Fly to me Request"
  //         text="Your request was sent!"
  //         showCloseButton
  //       />,
  //       TOAST_COMMON_OPTIONS
  //     );
  //   } else {
  //     toast.info(
  //       <ToastContent
  //         headerIconName="fly-with-me"
  //         title="Fly to me Request"
  //         text={`${userName} has invited you to fly to them`}
  //         declineInfo={{title: t('actions.decline')}}
  //         approveInfo={{
  //           title: t('actions.join'),
  //           onClick: () => instance3DStore.teleportToUser(userId)
  //         }}
  //       />,
  //       TOAST_NOT_AUTO_CLOSE_OPTIONS
  //     );
  //   }
  // });

  usePosBusEvent('high-five', (senderId, message) => {
    console.info('[POSBUS EVENT] high-five', senderId, message);
    toast.info(
      <HighFiveContent
        message={message}
        sendBack={() => {
          world3dStore?.sendHighFiveBack(senderId);
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

  // usePosBusEvent('notify-gathering-start', (message) => {
  //   console.info('[POSBUS EVENT] notify-gathering-start', message);

  //   toast.info(
  //     <ToastContent
  //       headerIconName="calendar"
  //       title={t('titles.joinGathering')}
  //       text={t('messages.joinGathering', {title: message.title})}
  //       approveInfo={{
  //         title: t('actions.dismiss')
  //       }}
  //       showCloseButton
  //     />,
  //     TOAST_NOT_AUTO_CLOSE_OPTIONS
  //   );
  // });

  // usePosBusEvent('simple-notification', (message) => {
  //   console.info('[POSBUS EVENT] simple-notification', message);
  //   toast.info(
  //     <ToastContent
  //       headerIconName="check"
  //       title={t('titles.alert')}
  //       text={message}
  //       showCloseButton
  //     />
  //   );
  // });

  // if (!instance3DStore.unityContext) {
  //   return <></>;
  // }

  console.log('WorldPage render', {worldId, world3dStore});

  return (
    <styled.Inner
      data-testid="UnityPage-test"
      // it gets called after object click thus requiring to put some delays to its handler
      // onObjectClick now provides this info, so commenting this out
      // onClick={(event) => {
      //   world3dStore?.setLastClickPosition(event.clientX, event.clientY);
      // }}
    >
      <BabylonScene
        events={Event3dEmitter}
        onMove={handleUserMove}
        onObjectClick={handleObjectClick}
        onObjectTransform={handleObjectTransform}
        onUserClick={handleUserClick}
        onClickOutside={handleClickOutside}
      />
    </styled.Inner>
  );
};

export default observer(WorldPage);
