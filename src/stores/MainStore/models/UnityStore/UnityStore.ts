import {types} from 'mobx-state-tree';
import {UnityContext} from 'react-unity-webgl';

import {ROUTES} from 'core/constants';
import {appConstants} from 'api/constants';
import UnityService from 'context/Unity/UnityService';

const UnityStore = types
  .model('UnityStore', {
    isInitialized: false,
    isPaused: false,
    teleportReady: false
  })
  .volatile<{unityContext: UnityContext | null}>(() => ({
    unityContext: null
  }))
  .actions((self) => ({
    init(): void {
      self.unityContext = new UnityContext({
        loaderUrl: appConstants.UNITY_CLIENT_LOADER_URL,
        dataUrl: appConstants.UNITY_CLIENT_DATA_URL,
        frameworkUrl: appConstants.UNITY_CLIENT_FRAMEWORK_URL,
        codeUrl: appConstants.UNITY_CLIENT_CODE_URL,
        streamingAssetsUrl: appConstants.UNITY_CLIENT_STREAMING_ASSETS_URL,
        companyName: appConstants.UNITY_CLIENT_COMPANY_NAME,
        productName: appConstants.UNITY_CLIENT_PRODUCT_NAME,
        productVersion: appConstants.UNITY_CLIENT_PRODUCT_VERSION
      });

      UnityService.initialize(self.unityContext);
      self.isInitialized = true;
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
    changeKeyboardControl(isActive: boolean) {
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
    teleportIsReady(): void {
      self.teleportReady = true;
    }
  }));

export {UnityStore};
