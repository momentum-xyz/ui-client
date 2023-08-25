import {types} from 'mobx-state-tree';

import {WorldInfoModelInterface, UserInfoModelInterface} from 'core/models';

import {Universe2dStore, Universe3dStore, World2dStore, World3dStore, ObjectStore} from './models';

const UniverseStore = types
  .model('UniverseStore', {
    universe2dStore: types.optional(Universe2dStore, {}),
    universe3dStore: types.optional(Universe3dStore, {}),
    objectStore: types.optional(ObjectStore, {}),
    world2dStore: types.maybeNull(World2dStore),
    world3dStore: types.maybeNull(World3dStore)
  })
  .actions((self) => ({
    init(): void {
      self.universe2dStore.init();
      // it's called on user change as well, important to refetch stuff
      if (self.world2dStore) {
        const worldId = self.world2dStore.worldId;
        self.world2dStore.init(worldId);
      }
    },
    enterWorld(worldId: string): void {
      self.world3dStore = World3dStore.create({worldId});
      self.world3dStore.init();

      self.world2dStore = World2dStore.create();
      self.world2dStore.init(worldId);
    },
    leaveWorld(): void {
      self.world2dStore?.unsubscribe();
      self.world2dStore = null;
      self.world3dStore = null;
    }
  }))
  .views((self) => ({
    get worldId(): string {
      return self.world2dStore?.worldId || '';
    },
    get isCreatorMode(): boolean {
      return self.world3dStore?.isCreatorMode || false;
    },
    get isScreenRecording(): boolean {
      return self.world3dStore?.isScreenRecording || false;
    },
    get isMyWorld(): boolean {
      return self.world2dStore?.isMyWorld || false;
    },
    get isCurrentUserWorldAdmin(): boolean {
      return self.world2dStore?.isCurrentUserWorldAdmin || false;
    }
  }))
  .views((self) => ({
    get allWorlds(): WorldInfoModelInterface[] {
      return self.universe2dStore.allWorlds;
    },
    get allUsers(): UserInfoModelInterface[] {
      return self.universe2dStore.allUsers;
    }
  }));

export {UniverseStore};
