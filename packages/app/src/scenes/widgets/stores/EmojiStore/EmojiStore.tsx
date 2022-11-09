import {types, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {EmojiDetail} from 'core/models';
import {api} from 'api';

const EmojiStore = types
  .compose(
    ResetModel,
    types.model('EmojiStore', {
      worldId: types.optional(types.string, ''),
      selectionDialog: types.optional(Dialog, {}),
      emojiDetailsList: types.optional(types.array(EmojiDetail), []),
      fetchSpaceEmojisRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchAll: flow(function* () {
      // TODO: implement next step for getting all emojis, waiting for EP
      yield self.fetchSpaceEmojisRequest.send(api.spaceEmojiRepository.fetchWorldEmojies, {
        worldId: self.worldId
      });
    })
  }))
  .actions((self) => ({
    init: flow(function* (worldId) {
      self.worldId = worldId;

      yield self.fetchAll();
    })
  }));
export {EmojiStore};
