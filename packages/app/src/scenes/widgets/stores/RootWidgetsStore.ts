import {types} from 'mobx-state-tree';

import {FlyToMeStore} from './FlyToMeStore';

const RootWidgetsStore = types.model('RootWidgetsStore', {
  flyToMeStore: types.optional(FlyToMeStore, {})
});

export {RootWidgetsStore};
