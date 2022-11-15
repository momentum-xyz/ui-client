import {types, flow, cast} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {EmojiDetail, EmojiDetailModelInterface} from 'core/models';
import {api, GetSpaceAttributeResponse} from 'api';
import {mapper} from 'api/mapper';

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
    fetchWorldEmojis: flow(function* () {
      const response: GetSpaceAttributeResponse = yield self.fetchSpaceEmojisRequest.send(
        api.emojiRepository.fetchWorldEmojis,
        {
          spaceId: self.worldId
        }
      );

      if (Object.keys(response).length) {
        const emojiData = mapper
          .mapSpaceAttributeItemsValue<Array<EmojiDetailModelInterface>>(response)
          .map((emoji) => Object.values(emoji)[0])
          .filter((emoji) => !!emoji ?? false);

        if (emojiData) {
          self.emojiDetailsList = cast(emojiData);
        }
      }

      return self.fetchSpaceEmojisRequest.isDone;
    })
  }))
  .actions((self) => ({
    init: flow(function* (worldId) {
      self.worldId = worldId;

      yield self.fetchWorldEmojis();
    })
  }));
export {EmojiStore};
