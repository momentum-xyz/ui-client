import {Instance, flow, types, cast} from 'mobx-state-tree';
import {MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {Event3dEmitter, MediaInterface, ObjectTypeIdEnum, RequestModel} from '@momentum-xyz/core';

import {getRootStore} from 'core/utils';
import {CreatorTabsEnum, WidgetEnum} from 'core/enums';
import {PosBusService} from 'shared/services';
import {
  FetchWorldTreeResponse,
  api,
  GetObjectAttributeResponse,
  GetUserContributionsResponse
} from 'api';
import {CanvasConfigInterface} from 'api/interfaces';
import {PluginIdEnum} from 'api/enums';

const World3dStore = types
  .model('World3dStore', {
    worldId: types.string,
    isCreatorMode: false,
    selectedObjectId: types.maybeNull(types.string),
    attachedToCameraObjectId: types.maybeNull(types.string),

    waitingForBumpEffectReadyUserId: types.maybeNull(types.string),

    worldTree: types.maybeNull(types.frozen<FetchWorldTreeResponse>()),
    fetchWorldTreeRequest: types.optional(RequestModel, {}),

    canvasObjectId: types.maybeNull(types.string),
    canvasConfig: types.maybeNull(types.frozen<CanvasConfigInterface>()),
    contributionCount: 0,

    fetchCanvasRequest: types.optional(RequestModel, {}),
    fetchCanvasConfigRequest: types.optional(RequestModel, {}),
    fetchContributionsRequest: types.optional(RequestModel, {}),

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
    handleClick(objectId: string, tabToSelect?: keyof typeof CreatorTabsEnum) {
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

        if (tabToSelect) {
          creatorStore.setSelectedTab(tabToSelect);
        } else if (creatorStore.selectedTab === null) {
          creatorStore.setSelectedTab('inspector');
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
    flyToObject(objectId: string) {
      Event3dEmitter.emit('FlyToObject', objectId);
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
    openDeleteObjectDialog(objectId: string) {
      const {
        widgetStore: {creatorStore}
      } = getRootStore(self);
      // temp, we use currently selected object id for delete - it'd be better to use deleteObjectId or smt
      self.handleClick(objectId).then(() => {
        if (creatorStore.selectedObjectId === objectId) {
          creatorStore.removeObjectDialog.open();
        }
      });
    }
  }))
  .actions((self) => ({
    fetchWorldTree: flow(function* () {
      self.worldTree = yield self.fetchWorldTreeRequest.send(api.objectRepository.fetchWorldTree, {
        worldId: self.worldId
      });
    })
  }))
  .actions((self) => ({
    fetchCanvasObject: flow(function* () {
      const response: FetchWorldTreeResponse = yield self.fetchCanvasRequest.send(
        api.objectRepository.fetchWorldTree,
        {
          max_depth: 1,
          worldId: self.worldId,
          object_type: ObjectTypeIdEnum.CANVAS
        }
      );

      if (response?.total_direct_children > 0) {
        const objectArray = Object.values(response.children);
        self.canvasObjectId = objectArray[0].id;
      } else {
        self.canvasObjectId = null;
      }
    }),
    loadCanvasConfig: flow(function* () {
      if (self.canvasObjectId) {
        const configAttribute: GetObjectAttributeResponse | null =
          yield self.fetchCanvasConfigRequest.send(
            api.objectAttributeRepository.getObjectAttribute,
            {
              objectId: self.canvasObjectId,
              plugin_id: PluginIdEnum.CANVAS_EDITOR,
              attribute_name: AttributeNameEnum.CANVAS
            }
          );

        if (configAttribute) {
          self.canvasConfig = cast(configAttribute as CanvasConfigInterface);
        }
      }
    }),
    loadContributionCount: flow(function* () {
      if (self.canvasObjectId) {
        const response: GetUserContributionsResponse = yield self.fetchContributionsRequest.send(
          api.canvasRepository.getUserContributions,
          {
            objectId: self.canvasObjectId
          }
        );

        if (response) {
          self.contributionCount = cast(response.count);
        }
      }
    }),
    async init(): Promise<void> {
      await this.fetchCanvasObject();
      await this.loadCanvasConfig();
      await this.loadContributionCount();
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
  }))
  .views((self) => ({
    get isContributionLimitReached(): boolean {
      return self.contributionCount >= (self.canvasConfig?.contributionAmount || 0);
    }
  }));

export interface World3dStoreModelInterface extends Instance<typeof World3dStore> {}

export {World3dStore};
