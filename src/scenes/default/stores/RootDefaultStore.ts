import {Instance, types} from 'mobx-state-tree';

import {HomeStore} from './HomeStore';

const RootDefaultStore = types
  .model('RootDefaultStore', {
    homeStore: types.optional(HomeStore, {})
  })
  .actions(() => ({}))
  .views(() => ({}));

export interface RootDefaultStoreInterface extends Instance<typeof RootDefaultStore> {}

export {RootDefaultStore};
