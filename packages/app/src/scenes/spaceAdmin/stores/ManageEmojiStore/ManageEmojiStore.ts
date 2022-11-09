import {types, cast, flow} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';

import {EmojiDetail, EmojiDetailModelInterface} from 'core/models';
import {api, UploadImageResponse, GetSpaceAttributeResponse} from 'api';
import {mapper} from 'api/mapper';

const ManageEmojiStore = types
  .compose(
    ResetModel,
    types.model('ManageEmojiStore', {
      uploadDialog: types.optional(Dialog, {}),
      deleteDialog: types.optional(Dialog, {}),
      emojiDetail: types.maybe(EmojiDetail),
      fetchSpaceEmojiRequest: types.optional(RequestModel, {}),
      uploadEmojiRequest: types.optional(RequestModel, {}),
      createEmojiRequest: types.optional(RequestModel, {}),
      deleteEmojiRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchSpaceEmoji: flow(function* (spaceId: string) {
      const response: GetSpaceAttributeResponse = yield self.fetchSpaceEmojiRequest.send(
        api.emojiRepository.fetchEmojis,
        {
          spaceId
        }
      );

      if (Object.keys(response).length) {
        const emojiData = mapper.mapSubAttributeValue<EmojiDetailModelInterface>(response);
        if (emojiData) {
          self.emojiDetail = cast({
            ...emojiData
          });
        }
      } else {
        self.emojiDetail = undefined;
      }

      return self.fetchSpaceEmojiRequest.isDone;
    })
  }))
  .actions((self) => ({
    uploadEmojiToSpace: flow(function* (spaceId: string, file: File, name: string) {
      const uploadImageResponse: UploadImageResponse = yield self.uploadEmojiRequest.send(
        api.mediaRepository.uploadImage,
        {file}
      );

      if (!uploadImageResponse) {
        console.log('Failed to upload emoji');
        return false;
      }

      const {hash} = uploadImageResponse;
      const emojiId = uuidv4();

      const response: GetSpaceAttributeResponse = yield self.createEmojiRequest.send(
        api.emojiRepository.createEmoji,
        {spaceId, key: emojiId, hash, emojiId, name}
      );

      if (response) {
        const emojiData = mapper.mapSubAttributeValue<EmojiDetailModelInterface>(response);
        if (emojiData) {
          self.emojiDetail = cast({
            ...emojiData
          });
        }
      }

      return self.createEmojiRequest.isDone;
    }),
    deleteEmoji: flow(function* (spaceId: string, emojiId: string) {
      yield self.deleteEmojiRequest.send(api.emojiRepository.deleteEmoji, {
        key: emojiId,
        spaceId
      });

      return self.deleteEmojiRequest.isDone;
    })
  }))
  .views((self) => ({
    get isUploadPending(): boolean {
      return (
        self.uploadEmojiRequest.isPending ||
        self.createEmojiRequest.isPending ||
        self.fetchSpaceEmojiRequest.isPending
      );
    },
    get isDeletePending(): boolean {
      return self.deleteEmojiRequest.isPending || self.fetchSpaceEmojiRequest.isPending;
    }
  }));

export {ManageEmojiStore};
