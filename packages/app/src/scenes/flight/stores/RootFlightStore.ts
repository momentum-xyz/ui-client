import {types} from 'mobx-state-tree';
import {ResetModel} from '@momentum/core';

import {FlyWithMeStore} from './FlyWithMeStore';

const RootFlightStore = types.compose(
  ResetModel,
  types
    .model('RootFlyWithMeStore', {
      flyWithMeStore: types.optional(FlyWithMeStore, {})
    })
    .views((self) => ({
      get isFlightWithMe(): boolean {
        return self.flyWithMeStore.isActive;
      }
    }))
);

export {RootFlightStore};
