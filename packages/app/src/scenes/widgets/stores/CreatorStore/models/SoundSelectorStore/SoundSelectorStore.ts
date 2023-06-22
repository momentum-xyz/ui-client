import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

const SoundSelectorStore = types
  .compose(
    ResetModel,
    types.model('SoundSelectorStore', {
      request: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchSound: flow(function* (worldId: string) {})
  }));

export {SoundSelectorStore};
