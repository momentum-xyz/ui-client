import {types, cast, flow} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {DialogModel, EmojiDetails} from 'core/models';
import {
  api,
  AssignEmojiToSpaceResponse,
  WorldEmojiesResponse,
  UploadEmojiResponse,
  DeleteEmojiResponse
} from 'api';

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

      if (data) {
        self.emojiDetailsList = cast(data);
      }
    })
  }))
  .actions((self) => ({
    uploadEmojiToSpace: flow(function* (spaceId: string, file: File, name: string) {
      const addEmojiResponse: UploadEmojiResponse = yield self.uploadEmojisRequest.send(
        api.emojiRepository.uploadEmoji,
        {spaceId, file, name}
      );
      if (!addEmojiResponse) {
        console.log('Failed to upload emoji');
        return false;
      }

      const {emojiId} = addEmojiResponse;

      const assignedSpaceEmojiResponse: AssignEmojiToSpaceResponse =
        yield self.assignEmojisToSpaceRequest.send(api.spaceEmojiRepository.assignEmojiToSpace, {
          spaceId,
          emojiId
        });
      if (!assignedSpaceEmojiResponse) {
        console.log('Failed to assign emoji to space');
        return false;
      }

      yield self.fetchSpaceEmojies(spaceId);

      return true;
    }),
    deleteEmoji: flow(function* (spaceId: string, emojiId: string) {
      const response: DeleteEmojiResponse = yield self.deleteEmojiRequest.send(
        api.emojiRepository.deleteEmoji,
        {
          emojiId,
          spaceId
        }
      );
      if (!response) {
        console.log('Failed to delete emoji');
        return false;
      }

      yield self.fetchSpaceEmojies(spaceId);
      return true;
    })
  }))
  .views((self) => ({
    get isUploadPending(): boolean {
      return (
        self.uploadEmojisRequest.isPending ||
        self.assignEmojisToSpaceRequest.isPending ||
        self.fetchSpaceEmojisRequest.isPending
      );
    },
    get isDeletePending(): boolean {
      return self.deleteEmojiRequest.isPending || self.fetchSpaceEmojisRequest.isPending;
    }
  }));

export {ManageEmojiStore};
