import {Dialog, ResetModel} from '@momentum-xyz/core';
import {types} from 'mobx-state-tree';

const SocialStore = types.compose(
  ResetModel,
  types.model('SocialStore', {
    widget: types.optional(Dialog, {})
  })
);

export {SocialStore};
