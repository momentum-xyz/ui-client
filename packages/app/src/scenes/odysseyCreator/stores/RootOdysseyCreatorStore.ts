import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SkyboxSelectorStore} from './SkyboxSelectorStore';
import {SpawnAssetStore} from './SpawnAssetStore';
import {ObjectFunctionalityStore} from './ObjectFunctionalityStore';
import {ObjectColorStore} from './ObjectColorStore';

const RootOdysseyCreatorStore = types.compose(
  ResetModel,
  types.model('RootOdysseyCreatorStore', {
    skyboxSelectorStore: types.optional(SkyboxSelectorStore, {}),
    spawnAssetStore: types.optional(SpawnAssetStore, {}),
    objectFunctionalityStore: types.optional(ObjectFunctionalityStore, {}),
    objectColorStore: types.optional(ObjectColorStore, {})
  })
);

export {RootOdysseyCreatorStore};
