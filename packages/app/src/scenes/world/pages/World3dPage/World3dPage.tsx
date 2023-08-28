import {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useDebouncedCallback, MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit';
import {BabylonScene} from '@momentum-xyz/core3d';
import {
  useI18n,
  Event3dEmitter,
  ClickPositionInterface,
  ObjectTransformInterface,
  TransformNoScaleInterface,
  MediaEnum
} from '@momentum-xyz/core';

import {CreatorTabsEnum, WidgetEnum} from 'core/enums';
import {appVariables} from 'api/constants';
import {PosBusService} from 'shared/services';
import {subMenuKeyWidgetEnumMap} from 'core/constants';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {HighFiveContent, TOAST_BASE_OPTIONS, ToastContent} from 'ui-kit';

const World3dPage: FC = () => {
  const {universeStore, widgetManagerStore, sessionStore, widgetStore} = useStore();
  const {world3dStore, world2dStore, worldId} = universeStore;
  const {creatorStore} = widgetStore;
  const {selectedTab} = creatorStore;

  const [worldReadyToHandleEvents, setWorldReadyToHandleEvents] = useState<string>();

  const {t} = useI18n();

  console.log('[World3dPage]: World ', worldId);

  useEffect(() => {
    if (worldId && worldId === worldReadyToHandleEvents) {
      const teleportToWorld = () => {
        if (!PosBusService.isConnected()) {
          console.log(`[World3dPage]: PosBusService is not connected.`);
          setTimeout(() => {
            teleportToWorld();
          }, 1000);
          return;
        }

        // FIXME: Remove after fixing bug on posbus
        console.log(`[World3dPage]: PosBus - Set worldId: ${worldId}`);
        PosBusService.teleportToWorld(worldId);
      };
      teleportToWorld();
      world2dStore?.subscribe();
    }
  }, [worldId, worldReadyToHandleEvents, world2dStore]);

  useEffect(() => {
    if (!creatorStore.selectedObjectId || !universeStore.isCreatorMode) {
      Event3dEmitter.emit('ObjectEditModeChanged', 'n/a', false, false);
      return;
    }

    const highlightObject = !!creatorStore.selectedObjectId;
    const showGizmo = creatorStore.selectedTab === 'gizmo';

    Event3dEmitter.emit(
      'ObjectEditModeChanged',
      creatorStore.selectedObjectId || 'n/a',
      highlightObject,
      highlightObject && showGizmo
    );
  }, [creatorStore.selectedObjectId, creatorStore.selectedTab, universeStore.isCreatorMode]);

  const handleObjectClick = (objectId: string, clickPos: ClickPositionInterface) => {
    if (universeStore.isCreatorMode) {
      console.log('[World3dPage]: Handle object click in creator mode', objectId);
      world3dStore?.handleClick(objectId).catch((error) => {
        toast.error(<ToastContent icon="alert" text={error.message || ''} />);
      });
    } else if (!universeStore.isScreenRecording) {
      console.log('[World3dPage]: Handle object click, NOT creator mode', objectId);
      widgetManagerStore.open(WidgetEnum.OBJECT, PositionEnum.RIGHT, {id: objectId});
    }
  };

  const handleLevel2MenuOpen = useCallback(() => {
    const handleSubMenuActiveChange = (tab: keyof typeof CreatorTabsEnum): void => {
      const currentTabIsOnSubMenu = selectedTab && subMenuKeyWidgetEnumMap[selectedTab];
      const correspondingSubMenuWidget = subMenuKeyWidgetEnumMap[tab];

      if (correspondingSubMenuWidget) {
        widgetManagerStore.setSubMenuActiveKeys([correspondingSubMenuWidget]);
      } else if (currentTabIsOnSubMenu) {
        widgetManagerStore.setSubMenuActiveKeys([]);
      }
    };

    const handleTabSelection = (tab: keyof typeof CreatorTabsEnum): void => {
      creatorStore.setSelectedTab(tab);
      handleSubMenuActiveChange(tab);
    };

    const handleObjectDuplicate = () => {
      const {selectedObjectId} = creatorStore;

      if (!selectedObjectId) {
        return;
      }

      world3dStore?.closeAndResetObjectMenu();

      creatorStore.duplicateObject(selectedObjectId).then((objectId) => {
        console.log('Duplicated object', objectId);
      });
    };

    const submenuItems: MenuItemInterface<WidgetEnum>[] = [
      {
        key: WidgetEnum.ACTION,
        position: PositionEnum.CENTER,
        iconName: 'close_large',
        tooltip: t('actions.clearSelection'),
        onClick: () => world3dStore?.closeAndResetObjectMenu()
      },
      {
        key: WidgetEnum.MOVE_ITEM,
        position: PositionEnum.CENTER,
        iconName: 'direction-arrows',
        tooltip: t('actions.move'),
        onClick: () => handleTabSelection('gizmo')
      },
      {
        key: WidgetEnum.INSPECTOR,
        position: PositionEnum.CENTER,
        iconName: 'info',
        tooltip: t('actions.inspector'),
        onClick: () => handleTabSelection('inspector')
      },
      {
        key: WidgetEnum.DUPLICATE,
        position: PositionEnum.CENTER,
        iconName: 'copy',
        tooltip: t('actions.duplicateObject'),
        onClick: handleObjectDuplicate
      },
      {
        key: WidgetEnum.REMOVE,
        position: PositionEnum.CENTER,
        iconName: 'bin',
        tooltip: t('actions.deleteObject'),
        onClick: creatorStore.removeObjectDialog.open
      }
    ];

    const currentSubMenuInfo = widgetManagerStore.subMenuInfo;
    const isSameSubMenu = currentSubMenuInfo?.sourceItemKey === WidgetEnum.CREATOR;

    const activeSubMenuKeys = !currentSubMenuInfo
      ? [WidgetEnum.MOVE_ITEM]
      : isSameSubMenu
      ? currentSubMenuInfo?.activeKeys
      : [];
    widgetManagerStore.openSubMenu(
      WidgetEnum.CREATOR,
      submenuItems,
      PositionEnum.CENTER,
      activeSubMenuKeys
    );
  }, [creatorStore, selectedTab, t, widgetManagerStore, world3dStore]);

  useEffect(() => {
    if (creatorStore.selectedObjectId) {
      handleLevel2MenuOpen();
    } else {
      widgetManagerStore.closeSubMenu();
    }
  }, [creatorStore.selectedObjectId, handleLevel2MenuOpen, widgetManagerStore]);

  const handleClickOutside = () => {
    console.log('BabylonPage: handleClickOutside - ignore');
    // if (creatorStore.selectedTab === 'gizmo') {
    //   // deselect only with gizmo - other tabs have closing button
    //   world3dStore?.closeAndResetObjectMenu();
    //   widgetManagerStore.closeSubMenu();
    // }
  };

  const handleUserClick = (id: string, clickPosition: ClickPositionInterface) => {
    console.log('TODO BabylonPage: onUserClick', id);
    // widgetsStore.odysseyInfoStore.open(id);
  };

  const handleUserMove = useDebouncedCallback(
    (transform: TransformNoScaleInterface) => {
      console.log('BabylonPage: onMove', transform);
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

  const handleScreenshot = (file: File) => {
    world3dStore?.setScreenshotOrVideo({
      mediaType: MediaEnum.Screenshot,
      file: file
    });
  };

  const handleRecordedVideo = (file: File) => {
    world3dStore?.setScreenshotOrVideo({
      mediaType: MediaEnum.Video,
      file: file
    });
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

  return (
    <BabylonScene
      key={worldId}
      events={Event3dEmitter}
      renderURL={appVariables.RENDER_SERVICE_URL}
      onMove={handleUserMove}
      onObjectClick={handleObjectClick}
      onObjectTransform={handleObjectTransform}
      onUserClick={handleUserClick}
      onClickOutside={handleClickOutside}
      onBumpReady={handleBumpReady}
      onReadyToHandleEvents={() => {
        setWorldReadyToHandleEvents(worldId);
      }}
      onScreenshotReady={handleScreenshot}
      onVideoReady={handleRecordedVideo}
    />
  );
};

export default observer(World3dPage);
