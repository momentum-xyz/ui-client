import {types} from 'mobx-state-tree';
import {Dialog, ResetModel} from '@momentum-xyz/core';

const MutualConnectionsStore = types.compose(
  ResetModel,
  types.model('MutualConnectionsStore', {
    widget: types.optional(Dialog, {})
  })
);

export {MutualConnectionsStore};
