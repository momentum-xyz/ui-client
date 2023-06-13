import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UploadFileResponse} from 'api';

const MediaUploader = types.compose(
  ResetModel,
  types
    .model('MediaUploader', {
      fileRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      uploadImageOrVideo: flow(function* (file?: File, isVideo?: boolean) {
        if (!file) {
          return null;
        }

        const fileResponse: UploadFileResponse = yield self.fileRequest.send(
          isVideo ? api.mediaRepository.uploadVideo : api.mediaRepository.uploadImage,
          {file: file}
        );

        return fileResponse?.hash || null;
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.fileRequest.isPending;
      }
    }))
);

export {MediaUploader};
