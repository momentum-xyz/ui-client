import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {OdysseyCreatorSkyboxesStore} from './OdysseyCreatorSkyboxesStore';
import {OdysseyCreatorAssets3dStore} from './OdysseyCreatorAssets3dStore';
import {OdysseyCreatorObjectStore} from './OdysseyCreatorObjectStore';

const RootOdysseyCreatorStore = types.compose(
  ResetModel,
  types.model('RootOdysseyCreatorStore', {
    odysseyCreatorSkyboxesStore: types.optional(OdysseyCreatorSkyboxesStore, {}),
    odysseyCreatorAssets3dStore: types.optional(OdysseyCreatorAssets3dStore, {}),
    odysseyCreatorObjectStore: types.optional(OdysseyCreatorObjectStore, {}),
    haveAccess: types.maybe(types.boolean)
  })
);

export {RootOdysseyCreatorStore};
