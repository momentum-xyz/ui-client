import {Instance, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum/sdk';

import {MiroBoardStore} from './MiroBoardStore';

const RootStore = types.compose(
  ResetModel,
  types.model('RootStore', {
    miroBoardStore: types.optional(MiroBoardStore, {})
  })
);

export type RootStoreType = Instance<typeof RootStore>;

export {RootStore};
