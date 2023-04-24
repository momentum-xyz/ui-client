import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {CreatorTabsEnum} from 'core/enums';

import {SkyboxSelectorStore} from './SkyboxSelectorStore';
import {SpawnAssetStore} from './SpawnAssetStore';
import {SpawnPointStore} from './SpawnPointStore';
import {ObjectFunctionalityStore} from './ObjectFunctionalityStore';
import {ObjectColorStore} from './ObjectColorStore';

type CreatorTabsType = keyof typeof CreatorTabsEnum;

const RootOdysseyCreatorStore = types
  .compose(
    ResetModel,
    types.model('RootOdysseyCreatorStore', {
      skyboxSelectorStore: types.optional(SkyboxSelectorStore, {}),
      spawnAssetStore: types.optional(SpawnAssetStore, {}),
      spawnPointStore: types.optional(SpawnPointStore, {}),
      objectFunctionalityStore: types.optional(ObjectFunctionalityStore, {}),
      objectColorStore: types.optional(ObjectColorStore, {}),
      selectedTab: types.maybeNull(types.enumeration(Object.keys(CreatorTabsEnum))),
      selectedObjectId: types.maybeNull(types.string)
    })
  )
  .actions((self) => ({
    setSelectedObjectId(id: string | null) {
      self.selectedObjectId = id;
    },
    setSelectedTab(tab: CreatorTabsType | null) {
      self.selectedTab = tab;
    }
  }));

export {RootOdysseyCreatorStore};
