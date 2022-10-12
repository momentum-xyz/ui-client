import {flow, types} from 'mobx-state-tree';
import {UnityContext} from 'react-unity-webgl';
import {RequestModel} from '@momentum/core';

import {api} from 'api';
import {appVariables} from 'api/constants';
import {PosBusEventEnum} from 'core/enums';
import {UnityService} from 'shared/services';

const DEFAULT_UNITY_VOLUME = 0.75;
const UNITY_VOLUME_STEP = 0.1;

const UnityStore = types
  .model('UnityStore', {
    isInitialized: false,
    isTeleportReady: false,
    muted: false,
    volume: types.optional(types.number, DEFAULT_UNITY_VOLUME),
    fetchRequest: types.optional(RequestModel, {})
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
    leaveSpace(spaceId: string) {
      UnityService.leaveSpace(spaceId);
    },
    // FIXME: Temporary solution. To get space name from Unity
    fetchSpaceName: flow(function* (spaceId: string) {
      const response = yield self.fetchRequest.send(api.spaceRepository.fetchSpace, {spaceId});
      if (response) {
        return response.space.name;
      }
    })
  }))
  .views((self) => ({
    get isPaused(): boolean {
      return UnityService.isPaused;
    }
  }));

export {UnityStore};
