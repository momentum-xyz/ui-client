import {Instance, types} from 'mobx-state-tree';

import {SignUpCompleteStore} from './SignUpCompleteStore';

const RootProfileStore = types.model('RootProfileStore', {
  signUpCompleteStore: types.optional(SignUpCompleteStore, {})
});

export interface RootRootProfileStoreInterface extends Instance<typeof RootProfileStore> {}

export {RootProfileStore};
