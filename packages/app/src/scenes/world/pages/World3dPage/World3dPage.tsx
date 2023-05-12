import {FC, useEffect, useMemo, useState} from 'react';
import {matchPath, useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {PositionEnum, useDebouncedCallback} from '@momentum-xyz/ui-kit-storybook';
import {BabylonScene} from '@momentum-xyz/odyssey3d';
import {
  Event3dEmitter,
  ClickPositionInterface,
  ObjectTransformInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';

import {WidgetEnum} from 'core/enums';
import {appVariables} from 'api/constants';
import {PosBusService} from 'shared/services';
import {WORLD_ROUTES} from 'scenes/App.routes';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {HighFiveContent, TOAST_BASE_OPTIONS} from 'ui-kit';

const World3dPage: FC = () => {
  const {agoraStore, universeStore, widgetManagerStore, sessionStore, creatorStore} = useStore();
  const {world3dStore} = universeStore;

  const [readyToHandleEvents, setReadyToHandleEvents] = useState<boolean>(false);

  const location = useLocation();

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
      agoraStore.initUsers(worldId);
    }
    return () => {
      agoraStore.leaveVoiceChat();
      widgetManagerStore.closeAll();
    };
  }, [worldId, agoraStore, widgetManagerStore]);

  useEffect(() => {
    if (worldId && readyToHandleEvents) {
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
  }, [worldId, universeStore, readyToHandleEvents]);

  useEffect(() => {
    if (
      creatorStore.selectedObjectId &&
      universeStore.isCreatorMode &&
      creatorStore.selectedTab === 'gizmo'
    ) {
      Event3dEmitter.emit('ObjectEditModeChanged', creatorStore.selectedObjectId, true);
    } else {
      Event3dEmitter.emit('ObjectEditModeChanged', 'n/a', false);
    }
  }, [creatorStore.selectedObjectId, creatorStore.selectedTab, universeStore.isCreatorMode]);

  const handleObjectClick = (objectId: string, clickPos: ClickPositionInterface) => {
    if (universeStore.isCreatorMode) {
      console.log('BabylonPage: handle object click in creator mode', objectId);

      // TODO take coords from event
      // instance3DStore.setLastClickPosition

      // navigate(generatePath(ROUTES.odyssey.creator.base, {worldId: universeStore.worldId}));

      world3dStore?.handleClick(objectId, clickPos);
    } else {
      console.log('BabylonPage: handle object click, NOT creator mode', objectId);
      widgetManagerStore.open(WidgetEnum.OBJECT, PositionEnum.RIGHT, {id: objectId});
    }
  };

  const handleClickOutside = () => {
    console.log('BabylonPage: handleClickOutside');
    if (creatorStore.selectedTab === 'gizmo') {
      // deselect only with gizmo - other tabs have closing button
      world3dStore?.closeAndResetObjectMenu();
    }
  };

  const handleUserClick = (id: string, clickPosition: ClickPositionInterface) => {
    console.log('TODO BabylonPage: onUserClick', id);
    // widgetsStore.odysseyInfoStore.open(id);
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

  const handleBumpReady = () => {
    const sender_id = sessionStore.user?.id;
    if (world3dStore?.waitingForBumpEffectReadyUserId && sender_id) {
      const receiverId = world3dStore.waitingForBumpEffectReadyUserId;
      world3dStore.setWaitingForBumpEffectReadyUserId(null);

      console.log('Bump effect ready - sendHighFive from', sender_id, 'to', receiverId);
      PosBusService.sendHighFive(sender_id, receiverId);
      Event3dEmitter.emit('SendHighFive', receiverId);
    }
  };

  usePosBusEvent('high-five', (senderId, message) => {
    console.info('[POSBUS EVENT] high-five', senderId, message);
    toast.info(
      <HighFiveContent
        message={message}
        sendBack={() => {
          // TODO turn/fly to sender???
          world3dStore?.sendHighFive(senderId);
        }}
        showCloseButton
      />,
      TOAST_BASE_OPTIONS
    );
    Event3dEmitter.emit('ReceiveHighFive', senderId);
  });

  console.log('WorldPage render', {worldId, world3dStore});

  return (
    <BabylonScene
      events={Event3dEmitter}
      renderURL={appVariables.RENDER_SERVICE_URL}
      onMove={handleUserMove}
      onObjectClick={handleObjectClick}
      onObjectTransform={handleObjectTransform}
      onUserClick={handleUserClick}
      onClickOutside={handleClickOutside}
      onBumpReady={handleBumpReady}
      onReadyToHandleEvents={() => {
        setReadyToHandleEvents(true);
      }}
    />
  );
};

export default observer(World3dPage);
