import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SkyboxSelectorStore} from './SkyboxSelectorStore';
import {SpawnAssetStore} from './SpawnAssetStore';
import {SpawnPointStore} from './SpawnPointStore';
import {ObjectFunctionalityStore} from './ObjectFunctionalityStore';
import {ObjectColorStore} from './ObjectColorStore';

const RootOdysseyCreatorStore = types.compose(
  ResetModel,
  types.model('RootOdysseyCreatorStore', {
    skyboxSelectorStore: types.optional(SkyboxSelectorStore, {}),
    spawnAssetStore: types.optional(SpawnAssetStore, {}),
    spawnPointStore: types.optional(SpawnPointStore, {}),
    objectFunctionalityStore: types.optional(ObjectFunctionalityStore, {}),
    objectColorStore: types.optional(ObjectColorStore, {})
  })
);

export {RootOdysseyCreatorStore};
