import {cast, types} from 'mobx-state-tree';
import {
  RequestModel,
  Event3dEmitter,
  ClickPositionInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';
import {MenuItemInterface, PositionEnum} from '@momentum-xyz/ui-kit-storybook';
import {UnityControlInterface} from '@momentum-xyz/sdk';

// import {api, ResolveNodeResponse} from 'api';
// import {appVariables} from 'api/constants';
import {GizmoTypeEnum, PosBusEventEnum, WidgetEnum} from 'core/enums';
import {UnityPositionInterface} from 'core/interfaces';
import {getRootStore} from 'core/utils';

const DEFAULT_UNITY_VOLUME = 0.75;
// const UNITY_VOLUME_STEP = 0.1;

// const defaultClickPosition = {x: 0, y: 0};

const World3dStore = types
  .model('World3dStore', {
    // TODO: objectList: array
    isInitialized: false,
    userCurrentTransform: types.maybeNull(types.frozen<TransformNoScaleInterface>()),
    muted: false,
    volume: types.optional(types.number, DEFAULT_UNITY_VOLUME),
    nodeRequest: types.optional(RequestModel, {}),
    // lastClickPosition: types.optional(types.frozen<{x: number; y: number}>(), {x: 0, y: 0}),
    // objectMenuPosition: types.optional(
    //   types.frozen<ClickPositionInterface>(),
    //   defaultClickPosition
    // ),
    // objectMenu: types.optional(Dialog, {}),

    isCreatorMode: false,
    selectedObjectId: types.maybeNull(types.string),
    attachedToCameraObjectId: types.maybeNull(types.string),

    waitingForBumpEffectReadyUserId: types.maybeNull(types.string),

    gizmoMode: types.optional(
      types.enumeration(Object.values(GizmoTypeEnum)),
      GizmoTypeEnum.POSITION
    )
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
    changeGizmoType(mode: GizmoTypeEnum) {
      self.gizmoMode = cast(mode);
      // TODO notify babylon
      // UnityService.changeGizmoType(mode);
    },
    closeAndResetObjectMenu() {
      console.log('closeAndResetObjectMenu', self.selectedObjectId);

      const {creatorStore} = getRootStore(self);
      creatorStore.setSelectedObjectId(null);
      creatorStore.setSelectedTab(null);

      const {widgetManagerStore} = getRootStore(self);
      widgetManagerStore.closeSubMenu();

      self._deselectObject();
      self.gizmoMode = GizmoTypeEnum.POSITION;
    }
  }))
  .actions((self) => ({
    // triggerTeleport(url?: string, worldId?: string): void {
    //   UnityService.triggerTeleport(url, worldId);
    // },
    getUserPosition(): UnityPositionInterface | null {
      // TODO
      return null;
      // let position: UnityPositionInterface | null = null;
      // try {
      //   const positionAsString = UnityService.getUserPosition?.() || null;
      //   if (positionAsString) {
      //     position = JSON.parse(positionAsString);
      //   }
      // } catch (ex) {
      //   console.error('getUserPosition', ex);
      // }

      // return position;
    },
    getUserRotation(): UnityPositionInterface | null {
      // TODO
      return null;
      // let rotation: UnityPositionInterface | null = null;
      // try {
      //   const rotationAsString = UnityService.getUserRotation?.() || null;
      //   if (rotationAsString) {
      //     rotation = JSON.parse(rotationAsString);
      //   }
      // } catch (ex) {
      //   console.error('getUserRotation', ex);
      // }

      // return rotation;
    },
    handleUserMove(transform: TransformNoScaleInterface): void {
      // FIXME storing it here changes the structure and breaks stuff
      // maybe deep-copy it or something?
      // self.userCurrentTransform = cast(transform);
    },
    teleportToUser(userId: string): void {
      // TODO Use Emitter3d
      // UnityService.teleportToUser(userId);
    },
    teleportToSpace(spaceId: string): void {
      // TODO Use Emitter3d
      // UnityService.teleportToSpace(spaceId);
    },
    teleportToVector3(vector: any): void {
      // TODO Use Emitter3d
      // UnityService.teleportToVector3(vector);
    },

    changeKeyboardControl(isActive: boolean): void {
      // TODO
      // UnityService.setKeyboardControl(isActive);
    },
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
    pause(): void {
      // TODO
      // UnityService.pause();
    },
    resume(): void {
      // TODO
      // UnityService.resume();
    },
    isPaused(): boolean {
      return false;
      // return UnityService.isPaused;
    },
    setInitialVolume() {
      // TODO
      // UnityService.setSoundEffectVolume(self.volume.toString());
    },
    mute() {
      // if (!self.muted) {
      //   self.volume = 0;
      //   self.muted = true;
      //   UnityService.toggleAllSound(self.muted);
      //   UnityService.setSoundEffectVolume(self.volume.toString());
      // }
    },
    unmute() {
      // self.volume = self.volume <= 1 - UNITY_VOLUME_STEP ? self.volume + UNITY_VOLUME_STEP : 1;
      // self.muted = false;
      // UnityService.toggleAllSound(self.muted);
      // UnityService.setSoundEffectVolume(self.volume.toString());
    },
    volumeChange(newVolume: number) {
      // if (newVolume === 0) {
      //   this.mute();
      //   return;
      // }
      // self.volume = newVolume;
      // self.muted = false;
      // UnityService.toggleAllSound(self.muted);
      // UnityService.setSoundEffectVolume(self.volume.toString());
    },
    triggerInteractionMessage(
      interaction: PosBusEventEnum,
      targetId: string,
      flag: number,
      message: string
    ) {
      // UnityService.triggerInteractionMsg?.(interaction, targetId, flag, message);
    },
    // startFlyWithMe(pilotId: string) {
    //   UnityService.startFlyWithMe(pilotId);
    // },
    // disengageFlyWithMe() {
    //   UnityService.disengageFlyWithMe();
    // },
    changeSkybox(skyboxId: string) {
      // TODO
      // UnityService.changeSkybox(skyboxId);
    },
    // resolveNode: flow(function* (object: string) {
    //   return yield self.nodeRequest.send(api.web3Repository.resolveNode, {object});
    // }),
    // async loadWorldById(worldId: string, token: string) {
    //   self.isTeleportReady = false;

    //   const response: ResolveNodeResponse = await this.resolveNode(worldId);
    //   if (response) {
    //     if (appVariables.UNITY_CLIENT_ADDRESSABLES_URL) {
    //       this.setAddressablesURL(appVariables.UNITY_CLIENT_ADDRESSABLES_URL);
    //     }
    //     this.setAuthToken(token);
    //     this.triggerTeleport(response.url, worldId);
    //     this.setInitialVolume();
    //   }
    // },
    // setLastClickPosition(x: number, y: number) {
    //   console.log('setLastClickPosition', x, y);
    //   self.lastClickPosition = {x, y};
    //   // this.closeAndResetObjectMenu();
    // },
    handleClick(objectId: string, clickPos?: ClickPositionInterface) {
      console.log('World3dStore : handleClick', objectId);
      if (!self.isCreatorMode) {
        return;
      }

      // TODO move it as child store here??
      const {creatorStore, widgetManagerStore} = getRootStore(self);

      // if (self.selectedObjectId) {
      //   console.log('World3dStore : handleClick : already selected', self.selectedObjectId);
      //   return;
      // }
      self._deselectObject();

      // self.objectMenuPosition = clickPos || defaultClickPosition;

      self._selectObject(objectId);
      // self.objectMenu.open();
      // self.setSelectedTab('inspector');

      creatorStore.setSelectedObjectId(objectId);

      const submenuItems: MenuItemInterface<WidgetEnum>[] = [
        {
          key: WidgetEnum.GO_TO,
          position: PositionEnum.CENTER,
          iconName: 'close_large',
          onClick: () => self.closeAndResetObjectMenu()
        },
        {
          key: WidgetEnum.GO_TO,
          position: PositionEnum.CENTER,
          iconName: 'direction-arrows',
          onClick: () => creatorStore.setSelectedTab('gizmo')
        },
        {
          key: WidgetEnum.GO_TO,
          position: PositionEnum.CENTER,
          iconName: 'info',
          onClick: () => creatorStore.setSelectedTab('inspector')
        },
        {
          key: WidgetEnum.GO_TO,
          position: PositionEnum.CENTER,
          iconName: 'cubicles',
          onClick: () => creatorStore.setSelectedTab('functionality')
        },
        {
          key: WidgetEnum.GO_TO,
          position: PositionEnum.CENTER,
          iconName: 'bin',
          onClick: creatorStore.removeObjectDialog.open
        }
      ];

      widgetManagerStore.openSubMenu(WidgetEnum.CREATOR, submenuItems, PositionEnum.CENTER);

      if (creatorStore.selectedTab === null) {
        creatorStore.setSelectedTab('gizmo');
      }
    },
    setAttachedToCamera(objectId: string | null) {
      if (!objectId && self.attachedToCameraObjectId) {
        Event3dEmitter.emit('DetachObjectFromCamera', self.attachedToCameraObjectId);
      }

      const {widgetManagerStore} = getRootStore(self);
      const submenuItems: MenuItemInterface<WidgetEnum>[] = [
        {
          key: WidgetEnum.GO_TO,
          position: PositionEnum.CENTER, // TODO 2nd floor
          iconName: 'checked',
          onClick: () => this.setAttachedToCamera(null)
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
  }))
  .views((self) => ({
    get unityControlInst(): UnityControlInterface {
      return {
        takeKeyboardControl: () => {
          self.changeKeyboardControl(false);
        },
        releaseKeyboardControl: () => {
          self.changeKeyboardControl(true);
        },
        pause: () => {
          self.pause();
        },
        resume: () => {
          self.resume();
        },
        isPaused: () => {
          return self.isPaused();
        }
      };
    }
  }));

export {World3dStore};
