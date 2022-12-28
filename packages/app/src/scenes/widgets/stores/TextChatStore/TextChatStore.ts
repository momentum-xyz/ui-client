import {Dialog, ResetModel} from '@momentum-xyz/core';
import {types} from 'mobx-state-tree';

import {StreamChatStore} from 'scenes/collaboration/stores/StreamChatStore';

const TextChatStore = types.compose(
  ResetModel,
  types.model('TextChatStore', {
    widget: types.optional(Dialog, {}),
    streamChatStore: types.optional(StreamChatStore, {})
  })
);

export {TextChatStore};
