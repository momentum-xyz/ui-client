import {types} from 'mobx-state-tree';
import {UnityContext} from 'react-unity-webgl';
import {ChangeEvent} from 'react';

import {PosBusEventEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {appVariables} from 'api/constants';
import {UnityService} from 'shared/services';

const UnityStore = types
  .model('UnityStore', {
    isInitialized: false,
    isTeleportReady: false,
    isPaused: false,
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
      if (!self.isPaused) {
        UnityService.setKeyboardControl(isActive);
      }
    },
    pause(): void {
      self.isPaused = true;
      UnityService.pause();
    },
    resume(): void {
      self.isPaused = false;
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
        UnityService.toggleAllSound();
        UnityService.setSoundEffectVolume('0');
        self.volume = 0;
        self.muted = true;
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
        UnityService.toggleAllSound();
        self.muted = false;
      }
    },
    volumeChange(slider: ChangeEvent<HTMLInputElement>) {
      const newVolume = parseFloat(slider.target.value);
      if (!self.muted && newVolume === 0) {
        UnityService.toggleAllSound();
      }
      if (self.muted && newVolume > 0) {
        UnityService.toggleAllSound();
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
    }
  }));

export {UnityStore};
