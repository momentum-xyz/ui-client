import {types, cast, flow} from 'mobx-state-tree';

import {DialogModel, RequestModel, ResetModel, EmojiDetails} from 'core/models';
import {api, EmojiConfigResponse} from 'api';
import {bytesToUuid} from 'core/utils';

const EmojiStore = types
  .compose(
    ResetModel,
    types.model('WorldStatsStore', {
      selectionDialog: types.optional(DialogModel, {}),
      emojiDetailsList: types.optional(types.array(EmojiDetails), []),
      fetchSpaceEmojisRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    init: flow(function* (worldId: string) {
      const response: EmojiConfigResponse = yield self.fetchSpaceEmojisRequest.send(
        api.emojiRepository.fetchSpaceEmojiConfig,
        {worldId}
      );

      const data = response
        .map(({emoji, emojiId, order, spaceId}) => ({
          ...emoji,
          id: bytesToUuid(emojiId.data),
          order,
          spaceId: bytesToUuid(spaceId.data)
        }))
        .sort((l, r) => l.order - r.order);

      self.emojiDetailsList = cast(data);
    })
  }));

export {EmojiStore};
