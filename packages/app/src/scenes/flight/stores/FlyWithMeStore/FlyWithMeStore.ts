import {types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum/core';

const FlyWithMeStore = types
  .compose(
    ResetModel,
    types.model('FlyWithMeStore', {
      isActive: false,
      kickRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    start(): void {
      self.isActive = true;
    },
    stop(): void {
      self.isActive = false;
    }
  }));

export {FlyWithMeStore};
