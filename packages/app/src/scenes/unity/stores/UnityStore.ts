import {types} from 'mobx-state-tree';

import {UnityService} from 'shared/services';

import {UnityInstanceStore} from './UnityInstanceStore';
import {UnityWorldStore} from './UnityWorldStore';

const UnityStore = types
  .model('UnityStore', {
    unityInstanceStore: types.optional(UnityInstanceStore, {}),
    unityWorldStore: types.optional(UnityWorldStore, {})
  })
  .views((self) => ({
    get worldId(): string {
      return self.unityWorldStore.worldId;
    },
    get isUnityAvailable(): boolean {
      return self.unityInstanceStore.isTeleportReady;
    },
    get isPaused(): boolean {
      return UnityService.isPaused;
    },
    get isBuildMode(): boolean {
      return UnityService.isBuildMode;
    },
    get isMyWorld(): boolean {
      return self.unityWorldStore.isMyWorld;
    },
    get isCurrentUserWorldAdmin(): boolean {
      return self.unityWorldStore.isCurrentUserWorldAdmin;
    }
  }));

export {UnityStore};
