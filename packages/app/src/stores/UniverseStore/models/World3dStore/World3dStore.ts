import {types} from 'mobx-state-tree';
import {MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit';
import {Event3dEmitter, MediaInterface, ClickPositionInterface} from '@momentum-xyz/core';

import {getRootStore} from 'core/utils';
import {WidgetEnum} from 'core/enums';
import {PosBusService} from 'shared/services';

const World3dStore = types
  .model('World3dStore', {
    isCreatorMode: false,
    selectedObjectId: types.maybeNull(types.string),
    attachedToCameraObjectId: types.maybeNull(types.string),

    waitingForBumpEffectReadyUserId: types.maybeNull(types.string),

    isScreenRecording: false,
    screenshotOrVideo: types.maybeNull(types.frozen<MediaInterface>())
  })
  .actions((self) => ({
    _selectObject(objectId: string): void {
      self.selectedObjectId = objectId;
      // Event3dEmitter.emit('ObjectEditModeChanged', objectId, true);
    },
    _deselectObject(): void {
      if (self.selectedObjectId) {
        // Event3dEmitter.emit('ObjectEditModeChanged', self.selectedObjectId, false);
        self.selectedObjectId = null;
      }
    }
  }))
  .actions((self) => ({
    selectObject(objectId: string) {
      return PosBusService.requestObjectLock(objectId).then(() => {
        self._selectObject(objectId);
      });
    },
    deselectObject() {
      if (self.selectedObjectId) {
        PosBusService.requestObjectUnlock(self.selectedObjectId);
        self._deselectObject();
      }
    }
  }))
  .actions((self) => ({
    setIsScreenRecording(isRecording: boolean): void {
      self.isScreenRecording = isRecording;
    },
    setScreenshotOrVideo(media: MediaInterface): void {
      self.screenshotOrVideo = media;
    },
    clearSnapshotOrVideo(): void {
      self.screenshotOrVideo = null;
    }
  }))
  .actions((self) => ({
    closeAndResetObjectMenu() {
      console.log('closeAndResetObjectMenu', self.selectedObjectId);
      const {widgetStore, widgetManagerStore} = getRootStore(self);

      widgetStore?.creatorStore?.setSelectedObjectId(null);
      widgetStore?.creatorStore.setSelectedTab(null);

      widgetManagerStore?.closeSubMenu();

      self.deselectObject();
    }
  }))
  .actions((self) => ({
    sendHighFive(receiverId: string): void {
      console.log('World3dStore: sendHighFive', receiverId);
      if (self.waitingForBumpEffectReadyUserId) {
        console.log(
          'World3dStore: sendHighFive: already waitingForBumpEffectReadyUserId',
          self.waitingForBumpEffectReadyUserId,
          ' - ignore'
        );
        return;
      }

      const sender_id = getRootStore(self).sessionStore.user?.id;
      if (sender_id) {
        // console.log('sendHighFive from', sender_id, 'to', receiverId);
        // PosBusService.sendHighFive(sender_id, receiverId);
        // Event3dEmitter.emit('SendHighFive', receiverId);

        console.log('Request Bump from', sender_id, 'to', receiverId);
        self.waitingForBumpEffectReadyUserId = receiverId;
        Event3dEmitter.emit('TriggerBump', receiverId);
      }
    },
    handleClick(objectId: string, clickPos?: ClickPositionInterface) {
      console.log('World3dStore : handleClick', objectId);
      if (!self.isCreatorMode) {
        throw new Error('World3dStore : handleClick : not in creator mode');
      }

      // TODO move it as child store here??
      const {widgetStore} = getRootStore(self);
      const {creatorStore} = widgetStore;

      // if (self.selectedObjectId) {
      //   console.log('World3dStore : handleClick : already selected', self.selectedObjectId);
      //   return;
      // }
      self.deselectObject();

      // self.objectMenuPosition = clickPos || defaultClickPosition;

      return self.selectObject(objectId).then(() => {
        // self.objectMenu.open();
        // self.setSelectedTab('inspector');

        // TODO move it as child store here??
        creatorStore.setSelectedObjectId(objectId);

        if (creatorStore.selectedTab === null) {
          creatorStore.setSelectedTab('gizmo');
        }
      });
    },
    setAttachedToCamera(objectId: string | null) {
      const {widgetManagerStore} = getRootStore(self);

      if (!objectId && self.attachedToCameraObjectId) {
        Event3dEmitter.emit('DetachObjectFromCamera', self.attachedToCameraObjectId);
        PosBusService.requestObjectUnlock(self.attachedToCameraObjectId);
      }

      const submenuItems: MenuItemInterface<WidgetEnum>[] = [
        {
          key: WidgetEnum.GO_TO,
          position: PositionEnum.CENTER, // TODO 2nd floor
          iconName: 'checked',
          onClick: () => {
            this.setAttachedToCamera(null);
            self.closeAndResetObjectMenu();
          }
        }
      ];

      if (objectId) {
        widgetManagerStore.openSubMenu(WidgetEnum.CREATOR, submenuItems, PositionEnum.CENTER);
      } else {
        widgetManagerStore.closeSubMenu();
      }

      self.attachedToCameraObjectId = objectId;
    },
    setWaitingForBumpEffectReadyUserId(userId: string | null) {
      self.waitingForBumpEffectReadyUserId = userId;
    },
    undo() {
      // UnityService.undo();
    },
    redo() {
      // UnityService.redo();
    },
    colorPickedPreview(objectId: string, colorHex: string) {
      // TODO notify babylon
      // UnityService.colorPickedPreview(objectId, colorHex);
    }
  }))
  .actions((self) => ({
    enableCreatorMode() {
      self.isCreatorMode = true;
    },
    disableCreatorMode() {
      self.isCreatorMode = false;
      self.closeAndResetObjectMenu();
    }
  }));

export {World3dStore};
