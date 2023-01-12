import {cast, flow, types} from 'mobx-state-tree';
import {UnityContext} from 'react-unity-webgl';
import {RequestModel, Dialog} from '@momentum-xyz/core';

import {api, ResolveNodeResponse} from 'api';
import {appVariables} from 'api/constants';
import {GizmoTypeEnum, PosBusEventEnum} from 'core/enums';
import {UnityService} from 'shared/services';

const DEFAULT_UNITY_VOLUME = 0.75;
const UNITY_VOLUME_STEP = 0.1;

const UnityStore = types
  .model('UnityStore', {
    isInitialized: false,
    isTeleportReady: false,
    muted: false,
    volume: types.optional(types.number, DEFAULT_UNITY_VOLUME),
    fetchRequest: types.optional(RequestModel, {}),
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
    init(): void {
      self.unityContext = new UnityContext({
        loaderUrl: appVariables.UNITY_CLIENT_LOADER_URL,
        dataUrl: appVariables.UNITY_CLIENT_DATA_URL,
        frameworkUrl: appVariables.UNITY_CLIENT_FRAMEWORK_URL,
        codeUrl: appVariables.UNITY_CLIENT_CODE_URL,
        streamingAssetsUrl: appVariables.UNITY_CLIENT_STREAMING_ASSETS_URL,
        companyName: appVariables.UNITY_CLIENT_COMPANY_NAME,
        productName: appVariables.UNITY_CLIENT_PRODUCT_NAME,
        productVersion: appVariables.UNITY_CLIENT_PRODUCT_VERSION
      });

      UnityService.initialize(self.unityContext);
      self.isInitialized = true;
    },
    teleportIsReady(): void {
      self.isTeleportReady = true;
    },
    setAuthToken(token?: string): void {
      UnityService.setAuthToken(token);
    },
    setTargetWorldId(id?: string): void {
      UnityService.setTargetWorldId(id);
    },
    triggerTeleport(domain?: string, worldId?: string): void {
      UnityService.triggerTeleport(domain, worldId);
    },
    getCurrentWorld(): string | null {
      return UnityService.getCurrentWorld?.() || null;
    },
    getUserPosition() {
      return UnityService.getUserPosition?.();
    },
    teleportToUser(userId: string): void {
      UnityService.teleportToUser(userId);
    },
    teleportToSpace(spaceId: string): void {
      UnityService.teleportToSpace(spaceId);
    },
    teleportToVector3(vector: any): void {
      UnityService.teleportToVector3(vector);
    },
    changeKeyboardControl(isActive: boolean): void {
      UnityService.setKeyboardControl(isActive);
    },
    sendHighFive(receiverId: string): void {
      UnityService.sendHighFive(receiverId);
    },
    sendHighFiveBack(receiverId: string): void {
      UnityService.sendHighFive(receiverId);
      UnityService.lookAtWisp(receiverId);
    },
    pause(): void {
      UnityService.pause();
    },
    resume(): void {
      UnityService.resume();
    },
    setInitialVolume() {
      UnityService.setSoundEffectVolume(self.volume.toString());
    },
    toggleMiniMap(): void {
      UnityService.toggleMiniMap();
    },
    showMinimap(): void {
      UnityService.showMinimap();
    },
    hideMinimap(): void {
      UnityService.hideMinimap();
    },
    mute() {
      if (!self.muted) {
        self.volume = 0;
        self.muted = true;
        UnityService.toggleAllSound(self.muted);
        UnityService.setSoundEffectVolume(self.volume.toString());
      }
    },
    unmute() {
      self.volume = self.volume <= 1 - UNITY_VOLUME_STEP ? self.volume + UNITY_VOLUME_STEP : 1;
      self.muted = false;
      UnityService.toggleAllSound(self.muted);
      UnityService.setSoundEffectVolume(self.volume.toString());
    },
    volumeChange(newVolume: number) {
      if (newVolume === 0) {
        this.mute();
        return;
      }

      self.volume = newVolume;
      self.muted = false;
      UnityService.toggleAllSound(self.muted);
      UnityService.setSoundEffectVolume(self.volume.toString());
    },
    triggerInteractionMessage(
      interaction: PosBusEventEnum,
      targetId: string,
      flag: number,
      message: string
    ) {
      UnityService.triggerInteractionMsg?.(interaction, targetId, flag, message);
    },
    startFlyWithMe(pilotId: string) {
      UnityService.startFlyWithMe(pilotId);
    },
    disengageFlyWithMe() {
      UnityService.disengageFlyWithMe();
    },
    changeSkybox(skyboxId: string) {
      UnityService.changeSkybox(skyboxId);
    },
    toggleBuildMode() {
      UnityService.toggleBuildMode();
    },
    leaveSpace(spaceId: string) {
      UnityService.leaveSpace(spaceId);
    },
    // FIXME: Temporary solution. To get space name from Unity
    fetchSpaceName: flow(function* (spaceId: string) {
      const response = yield self.fetchRequest.send(api.spaceRepositoryOld.fetchSpace, {spaceId});
      if (response) {
        return response.space.name;
      }
    }),
    resolveNode: flow(function* (object: string) {
      return yield self.nodeRequest.send(api.webRepository.resolveNode, {object});
    }),
    async loadWorldById(worldId: string, token: string) {
      self.isTeleportReady = false;

      const response: ResolveNodeResponse = await this.resolveNode(worldId);
      if (response) {
        this.setAuthToken(token);
        this.triggerTeleport(response.domain, worldId);
        this.setInitialVolume();
      }
    },
    handleClick(x: number, y: number) {
      self.lastClickPosition = {x, y};
      this.closeAndResetObjectMenu();
    },
    onUnityObjectClick(objectId: string) {
      self.objectMenuPosition = self.lastClickPosition;
      self.objectMenu.open();
      self.selectedObjectId = objectId;
    },
    undo() {
      UnityService.undo();
    },
    redo() {
      UnityService.redo();
    },
    changeGizmoType(mode: GizmoTypeEnum) {
      self.gizmoMode = cast(mode);
      UnityService.changeGizmoType(mode);
    },
    closeAndResetObjectMenu() {
      self.objectMenu.close();
      self.selectedObjectId = '';
      self.gizmoMode = GizmoTypeEnum.POSITION;
    }
  }))
  .views((self) => ({
    get isUnityAvailable(): boolean {
      return self.isTeleportReady;
    },
    get isPaused(): boolean {
      return UnityService.isPaused;
    },
    get isBuildMode(): boolean {
      return UnityService.isBuildMode;
    }
  }));

export {UnityStore};
