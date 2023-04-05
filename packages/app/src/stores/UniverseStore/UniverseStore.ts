import {types} from 'mobx-state-tree';

import {NftItemModelInterface} from 'core/models';

import {Universe2dStore, Universe3dStore, World2dStore, World3dStore} from './models';

const UniverseStore = types
  .model('UniverseStore', {
    universe2dStore: types.optional(Universe2dStore, {}),
    universe3dStore: types.optional(Universe3dStore, {}),
    world2dStore: types.maybeNull(World2dStore),
    world3dStore: types.maybeNull(World3dStore)
  })
  .actions((self) => ({
    init(): void {
      self.universe2dStore.init();
    },
    enterWorld(worldId: string): void {
      self.world3dStore = World3dStore.create();
      self.world2dStore = World2dStore.create();
      self.world2dStore.init(worldId);
    },
    leaveWorld(): void {
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
    get isMyWorld(): boolean {
      return self.world2dStore?.isMyWorld || false;
    },
    get isCurrentUserWorldAdmin(): boolean {
      return self.world2dStore?.isCurrentUserWorldAdmin || false;
    }
  }))
  .views((self) => ({
    get allWorlds(): NftItemModelInterface[] {
      return self.universe2dStore.allWorlds;
    },
    get allUsers(): NftItemModelInterface[] {
      return self.universe2dStore.allUsers;
    }
  }));

export {UniverseStore};
