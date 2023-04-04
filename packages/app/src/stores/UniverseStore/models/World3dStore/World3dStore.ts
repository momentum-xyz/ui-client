import {cast, types} from 'mobx-state-tree';
import {
  RequestModel,
  Dialog,
  Event3dEmitter,
  ClickPositionInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';
import {UnityControlInterface} from '@momentum-xyz/sdk';

// import {api, ResolveNodeResponse} from 'api';
// import {appVariables} from 'api/constants';
import {GizmoTypeEnum, PosBusEventEnum} from 'core/enums';
import {UnityPositionInterface} from 'core/interfaces';

const DEFAULT_UNITY_VOLUME = 0.75;
// const UNITY_VOLUME_STEP = 0.1;

const defaultClickPosition = {x: 0, y: 0};

const World3dStore = types
  .model('World3dStore', {
    // TODO: objectList: array
    isInitialized: false,
    userCurrentTransform: types.maybeNull(types.frozen<TransformNoScaleInterface>()),
    muted: false,
    volume: types.optional(types.number, DEFAULT_UNITY_VOLUME),
    nodeRequest: types.optional(RequestModel, {}),
    // lastClickPosition: types.optional(types.frozen<{x: number; y: number}>(), {x: 0, y: 0}),
    objectMenuPosition: types.optional(
      types.frozen<ClickPositionInterface>(),
      defaultClickPosition
    ),
    objectMenu: types.optional(Dialog, {}),
    isCreatorMode: false,
    selectedObjectId: types.maybeNull(types.string),

    gizmoMode: types.optional(
      types.enumeration(Object.values(GizmoTypeEnum)),
      GizmoTypeEnum.POSITION
    )
  })
  .actions((self) => ({
    _selectObject(objectId: string): void {
      self.selectedObjectId = objectId;
      Event3dEmitter.emit('ObjectEditModeChanged', objectId, true);
    },
    _deselectObject(): void {
      if (self.selectedObjectId) {
        Event3dEmitter.emit('ObjectEditModeChanged', self.selectedObjectId, false);
        self.selectedObjectId = null;
      }
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
      self.userCurrentTransform = transform;
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
      // TODO use posbus
      // UnityService.sendHighFive(receiverId);
    },
    sendHighFiveBack(receiverId: string): void {
      // UnityService.sendHighFive(receiverId);
      // UnityService.lookAtWisp(receiverId);
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

      self._deselectObject();

      self.objectMenuPosition = clickPos || defaultClickPosition;

      self._selectObject(objectId);
      self.objectMenu.open();
    },
    undo() {
      // UnityService.undo();
    },
    redo() {
      // UnityService.redo();
    },
    changeGizmoType(mode: GizmoTypeEnum) {
      self.gizmoMode = cast(mode);
      // TODO notify babylon
      // UnityService.changeGizmoType(mode);
    },
    closeAndResetObjectMenu() {
      console.log('closeAndResetObjectMenu', self.selectedObjectId);
      self.objectMenu.close();
      self._deselectObject();
      self.gizmoMode = GizmoTypeEnum.POSITION;
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
