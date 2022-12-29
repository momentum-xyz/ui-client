import {Dialog, ResetModel} from '@momentum-xyz/core';
import {types} from 'mobx-state-tree';

import {TextChat} from './models';

const TextChatStore = types.compose(
  ResetModel,
  types.model('TextChatStore', {
    dialog: types.optional(Dialog, {}),
    streamChat: types.optional(TextChat, {})
  })
);

export {TextChatStore};
