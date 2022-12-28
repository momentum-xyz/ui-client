import {Dialog, ResetModel} from '@momentum-xyz/core';
import {types} from 'mobx-state-tree';

const VoiceChatStore = types.compose(
  ResetModel,
  types.model('VoiceChatStore', {
    widget: types.optional(Dialog, {})
  })
);

export {VoiceChatStore};
