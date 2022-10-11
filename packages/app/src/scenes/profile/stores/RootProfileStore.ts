import {Instance, types} from 'mobx-state-tree';

import {SignUpCompleteStore} from './SignUpCompleteStore';

const RootProfileStore = types.model('RootProfileStore', {
  signUpCompleteStore: types.optional(SignUpCompleteStore, {})
});

export type RootRootProfileStoreType = Instance<typeof RootProfileStore>;

export {RootProfileStore};
