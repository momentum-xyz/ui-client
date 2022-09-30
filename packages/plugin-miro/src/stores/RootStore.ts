import {Instance, types} from 'mobx-state-tree';
import {ResetModel} from 'core/models';

import {MiroBoardStore} from './MiroBoardStore';

const RootStore = types.compose(
  ResetModel,
  types.model('RootStore', {
    miroBoardStore: types.optional(MiroBoardStore, {})
  })
);

export interface RootStoreInterface extends Instance<typeof RootStore> {}

export {RootStore};
