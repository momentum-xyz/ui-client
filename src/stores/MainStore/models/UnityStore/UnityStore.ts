import {types} from 'mobx-state-tree';
import {UnityContext} from 'react-unity-webgl';
import {ChangeEvent} from 'react';

import {ROUTES} from 'core/constants';
import {appVariables} from 'api/constants';
import {PosBusEventEnum} from 'core/enums';
import {UnityService} from 'shared/services';

const UnityStore = types
  .model('UnityStore', {
    isInitialized: false,
    isTeleportReady: false,
    muted: false,
    volume: types.optional(types.number, 0.1)
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
    teleportToUser(userId: string, navigationCallback: (path: string) => void): void {
      UnityService.teleportToUser(userId);
      navigationCallback(ROUTES.base);
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
      UnityService.setSoundEffectVolume('0.1');
    },
    setVolume(volume: number) {
      self.volume = volume;
    },
    mute() {
      if (!self.muted) {
        self.volume = 0;
        self.muted = true;
        UnityService.toggleAllSound(self.muted);
        UnityService.setSoundEffectVolume('0');
      }
    },
    unmute() {
      if (self.volume === 1) {
        return;
      }
      const newVolume = Math.min((self.muted ? 0 : self.volume) + 0.1, 1.0);
      self.volume = newVolume;
      UnityService.setSoundEffectVolume(newVolume.toString());
      if (self.muted) {
        UnityService.toggleAllSound(self.muted);
        self.muted = false;
      }
    },
    volumeChange(slider: ChangeEvent<HTMLInputElement>) {
      const newVolume = parseFloat(slider.target.value);
      if (!self.muted && newVolume === 0) {
        UnityService.toggleAllSound(self.muted);
      }
      if (self.muted && newVolume > 0) {
        UnityService.toggleAllSound(self.muted);
      }
      self.volume = newVolume;
      UnityService.setSoundEffectVolume(newVolume.toString());
    },
    triggerInteractionMessage(
      interaction: PosBusEventEnum,
      targetId: string,
      flag: number,
      message: string
    ) {
      UnityService.triggerInteractionMsg?.(interaction, targetId, flag, message);
    },
    leaveSpace(spaceId: string) {
      UnityService.leaveSpace(spaceId);
    }
  }));

export {UnityStore};
