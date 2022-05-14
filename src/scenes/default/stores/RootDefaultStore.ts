import {Instance, types} from 'mobx-state-tree';

import {DefaultStore} from './DefaultStore';

const RootDefaultStore = types
  .model('RootDefaultStore', {
    defaultStore: types.optional(DefaultStore, {})
  })
  .actions(() => ({}))
  .views(() => ({}));

export interface RootDefaultStoreInterface extends Instance<typeof RootDefaultStore> {}

export {RootDefaultStore};
