import {
  cast,
  // flow,
  types
} from 'mobx-state-tree';
import {UnityContext} from 'react-unity-webgl';
import {RequestModel, Dialog} from '@momentum-xyz/core';
import {UnityControlInterface} from '@momentum-xyz/sdk';

// import {api, ResolveNodeResponse} from 'api';
// import {appVariables} from 'api/constants';
import {GizmoTypeEnum, PosBusEventEnum} from 'core/enums';
import {UnityPositionInterface} from 'core/interfaces';
import {UnityService} from 'shared/services';

const DEFAULT_UNITY_VOLUME = 0.75;
// const UNITY_VOLUME_STEP = 0.1;

const Instance3DStore = types
  .model('Instance3DStore', {
    isInitialized: false,
    muted: false,
    volume: types.optional(types.number, DEFAULT_UNITY_VOLUME),
    nodeRequest: types.optional(RequestModel, {}),
    lastClickPosition: types.optional(types.frozen<{x: number; y: number}>(), {x: 0, y: 0}),
    objectMenuPosition: types.optional(types.frozen<{x: number; y: number}>(), {x: 0, y: 0}),
    objectMenu: types.optional(Dialog, {}),
    selectedObjectId: types.maybe(types.string),

    gizmoMode: types.optional(
      types.enumeration(Object.values(GizmoTypeEnum)),
      GizmoTypeEnum.POSITION
    )
  })
  .volatile<{unityContext: UnityContext | null}>(() => ({
    unityContext: null
  }))
  .actions((self) => ({
    triggerTeleport(url?: string, worldId?: string): void {
      UnityService.triggerTeleport(url, worldId);
    },
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
      UnityService.setKeyboardControl(isActive);
    },
    sendHighFive(receiverId: string): void {
      UnityService.sendHighFive(receiverId);
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
    toggleBuildMode() {
      UnityService.toggleBuildMode();
    },
    leaveSpace(spaceId: string) {
      // need this?
      // UnityService.leaveSpace(spaceId);
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
    setLastClickPosition(x: number, y: number) {
      self.lastClickPosition = {x, y};
      this.closeAndResetObjectMenu();
    },
    onObjectClick(objectId: string) {
      // self.objectMenuPosition = self.lastClickPosition;
      self.objectMenu.open();
      self.selectedObjectId = objectId;
    },
    undo() {
      // UnityService.undo();
    },
    redo() {
      // UnityService.redo();
    },
    changeGizmoType(mode: GizmoTypeEnum) {
      self.gizmoMode = cast(mode);
      UnityService.changeGizmoType(mode);
    },
    closeAndResetObjectMenu() {
      self.objectMenu.close();
      self.selectedObjectId = '';
      self.gizmoMode = GizmoTypeEnum.POSITION;
    },
    colorPickedPreview(objectId: string, colorHex: string) {
      UnityService.colorPickedPreview(objectId, colorHex);
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

export {Instance3DStore};
