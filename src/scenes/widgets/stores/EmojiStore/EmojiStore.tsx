import {types, cast, flow} from 'mobx-state-tree';

import {DialogModel, RequestModel, ResetModel, EmojiDetails} from 'core/models';
import {api, AssignEmojiToSpaceResponse, EmojiConfigResponse, UploadEmojiResponse} from 'api';

const EmojiStore = types
  .compose(
    ResetModel,
    types.model('EmojiStore', {
      worldId: types.optional(types.string, ''),
      selectionDialog: types.optional(DialogModel, {}),
      emojiDetailsList: types.optional(types.array(EmojiDetails), []),
      fetchSpaceEmojisRequest: types.optional(RequestModel, {}),
      uploadEmojisRequest: types.optional(RequestModel, {}),
      assignEmojisToSpaceRequest: types.optional(RequestModel, {}),
      deleteEmojiRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchAll: flow(function* () {
      const response: EmojiConfigResponse = yield self.fetchSpaceEmojisRequest.send(
        api.emojiRepository.fetchSpaceEmojiConfig,
        {worldId: self.worldId}
      );

      const data = response.sort((l, r) => l.order - r.order);

      self.emojiDetailsList = cast(data);
    })
  }))
  .actions((self) => ({
    init: flow(function* (worldId) {
      self.worldId = worldId;

      yield self.fetchAll();
    }),
    uploadEmojiToSpace: flow(function* (spaceId: string, file: File, name: string) {
      const addEmojiResponse: UploadEmojiResponse = yield self.uploadEmojisRequest.send(
        api.emojiRepository.uploadEmojiConfig,
        {spaceId, file, name}
      );

      const {emojiId} = addEmojiResponse;

      const assignedSpaceEmojiResponse: AssignEmojiToSpaceResponse =
        yield self.assignEmojisToSpaceRequest.send(api.emojiRepository.assignEmojiToSpace, {
          spaceId,
          emojiId
        });

      yield self.fetchAll();

      return assignedSpaceEmojiResponse;
    }),
    deleteEmoji: flow(function* (spaceId: string, emojiId: string, order: number) {
      yield self.deleteEmojiRequest.send(api.emojiRepository.deleteEmoji, {
        emojiId,
        spaceId,
        order
      });

      yield self.fetchAll();
    })
  }));
export {EmojiStore};
