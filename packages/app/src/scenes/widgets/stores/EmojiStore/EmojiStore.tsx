import {types, cast, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum/core';

import {EmojiDetails} from 'core/models';
import {api, WorldEmojiesResponse} from 'api';

const EmojiStore = types
  .compose(
    ResetModel,
    types.model('EmojiStore', {
      worldId: types.optional(types.string, ''),
      selectionDialog: types.optional(Dialog, {}),
      emojiDetailsList: types.optional(types.array(EmojiDetails), []),
      fetchSpaceEmojisRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchAll: flow(function* () {
      const data: WorldEmojiesResponse = yield self.fetchSpaceEmojisRequest.send(
        api.spaceEmojiRepository.fetchWorldEmojies,
        {worldId: self.worldId}
      );

      if (data) {
        self.emojiDetailsList = cast(data);
      }
    })
  }))
  .actions((self) => ({
    init: flow(function* (worldId) {
      self.worldId = worldId;

      yield self.fetchAll();
    })
  }));
export {EmojiStore};
