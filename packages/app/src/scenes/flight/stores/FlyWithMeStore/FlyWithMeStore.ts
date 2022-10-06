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
    init(): void {
      self.isActive = true;
    },
    start(spaceId: string, pilotId: string): void {
      // TODO: BE call
    },
    stop(spaceId: string): void {
      // TODO: BE call
    }
  }));

export {FlyWithMeStore};
