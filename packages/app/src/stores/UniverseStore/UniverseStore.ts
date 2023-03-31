import {types} from 'mobx-state-tree';

import {Instance3DStore} from '../Instance3DStore';
import {WorldStore} from '../WorldStore';

const UniverseStore = types
  .model('UniverseStore', {
    instance3DStore: types.optional(Instance3DStore, {}),
    activeWorldStore: types.optional(WorldStore, {})
  })
  .actions((self) => ({
    initTeleport(worldId: string): void {
      // self.instance3DStore.teleportIsReady();
      self.activeWorldStore.init(worldId);
    }
  }))
  .views((self) => ({
    get worldId(): string {
      return self.activeWorldStore.worldId;
    },
    // get isUnityAvailable(): boolean {
    //   return self.instance3DStore.isTeleportReady;
    // },
    get isCreatorMode(): boolean {
      return self.instance3DStore.isCreatorMode;
    },
    get isMyWorld(): boolean {
      return self.activeWorldStore.isMyWorld;
    },
    get isCurrentUserWorldAdmin(): boolean {
      return self.activeWorldStore.isCurrentUserWorldAdmin;
    }
  }));

export {UniverseStore};
