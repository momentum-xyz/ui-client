import {Dialog, ResetModel} from '@momentum-xyz/core';
import {types} from 'mobx-state-tree';

import {StreamChatStore} from 'scenes/collaboration/stores/StreamChatStore';

const SocialStore = types.compose(
  ResetModel,
  types.model('SocialStore', {
    widget: types.optional(Dialog, {}),
    streamChatStore: types.optional(StreamChatStore, {})
  })
);

export {SocialStore};
