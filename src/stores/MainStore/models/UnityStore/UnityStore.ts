import {types} from 'mobx-state-tree';
import {UnityContext} from 'react-unity-webgl';

import {ROUTES} from 'core/constants';
import {appVariables} from 'api/constants';
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
    teleportIsReady(): void {
      self.teleportReady = true;
    }
  }));

export {UnityStore};
