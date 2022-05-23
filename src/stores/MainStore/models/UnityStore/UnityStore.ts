import {types} from 'mobx-state-tree';

import UnityService from 'context/Unity/UnityService';
import {ROUTES} from 'core/constants';

const UnityStore = types
  .model('UnityStore', {
    isPaused: false,
    teleportReady: false
  })
  .actions((self) => ({
    teleportToUser(userId: string, navigationCallback: (path: string) => void) {
      UnityService.teleportToUser(userId);
      navigationCallback(ROUTES.base);
    },
    teleportToSpace(spaceId: string) {
      UnityService.teleportToSpace(spaceId);
    },
    teleportToVector3(vector: any) {
      UnityService.teleportToVector3(vector);
    },
    changeKeyboardControl(isActive: boolean) {
      if (!self.isPaused) {
        UnityService.setKeyboardControl(isActive);
      }
    },
    pause() {
      self.isPaused = true;
      UnityService.pause();
    },
    resume() {
      self.isPaused = false;
      UnityService.resume();
    },
    teleportIsReady() {
      self.teleportReady = true;
    }
  }))
  .views(() => ({}));

export {UnityStore};
