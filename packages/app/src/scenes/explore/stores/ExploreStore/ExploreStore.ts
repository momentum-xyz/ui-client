import {types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      request: types.optional(RequestModel, {})
    })
  )
  .actions(() => ({
    init(): void {}
  }));

export {ExploreStore};
