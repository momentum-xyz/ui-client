import {types, cast, flow} from 'mobx-state-tree';

import {DialogModel, RequestModel, ResetModel, EmojiDetails} from 'core/models';
import {api, AssignEmojiToSpaceResponse, WorldEmojiesResponse, UploadEmojiResponse} from 'api';

const ManageEmojiStore = types
  .compose(
    ResetModel,
    types.model('ManageEmojiStore', {
      uploadDialog: types.optional(DialogModel, {}),
      deleteDialog: types.optional(DialogModel, {}),
      emojiDetailsList: types.optional(types.array(EmojiDetails), []),
      fetchSpaceEmojisRequest: types.optional(RequestModel, {}),
      uploadEmojisRequest: types.optional(RequestModel, {}),
      assignEmojisToSpaceRequest: types.optional(RequestModel, {}),
      deleteEmojiRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchSpaceEmojies: flow(function* (spaceId: string) {
      const data: WorldEmojiesResponse = yield self.fetchSpaceEmojisRequest.send(
        api.spaceEmojiRepository.fetchSpaceEmoji,
        {spaceId}
      );

      self.emojiDetailsList = cast(data);
    })
  }))
  .actions((self) => ({
    uploadEmojiToSpace: flow(function* (spaceId: string, file: File, name: string) {
      const addEmojiResponse: UploadEmojiResponse = yield self.uploadEmojisRequest.send(
        api.emojiRepository.uploadEmoji,
        {spaceId, file, name}
      );

      const {emojiId} = addEmojiResponse;

      const assignedSpaceEmojiResponse: AssignEmojiToSpaceResponse =
        yield self.assignEmojisToSpaceRequest.send(api.spaceEmojiRepository.assignEmojiToSpace, {
          spaceId,
          emojiId
        });

      yield self.fetchSpaceEmojies(spaceId);

      return assignedSpaceEmojiResponse;
    }),
    deleteEmoji: flow(function* (spaceId: string, emojiId: string) {
      yield self.deleteEmojiRequest.send(api.emojiRepository.deleteEmoji, {
        emojiId,
        spaceId
      });

      yield self.fetchSpaceEmojies(spaceId);
    })
  }))
  .views((self) => ({
    get isUploadPending() {
      return (
        self.uploadEmojisRequest.isPending ||
        self.assignEmojisToSpaceRequest.isPending ||
        self.fetchSpaceEmojisRequest.isPending
      );
    },
    get isDeletePending() {
      return self.deleteEmojiRequest.isPending || self.fetchSpaceEmojisRequest.isPending;
    }
  }));

export {ManageEmojiStore};
