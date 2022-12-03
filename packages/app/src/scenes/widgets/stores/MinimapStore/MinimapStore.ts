import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

const MinimapStore = types.compose(
  ResetModel,
  types.model('MinimapStore', {
    minimapDialog: types.optional(Dialog, {})
  })
);

export {MinimapStore};
