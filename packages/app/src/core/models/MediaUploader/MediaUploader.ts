import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, UploadFileResponse} from 'api';
import {getFileFromUrl} from 'core/utils';

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
      }),
      uploadAudio: flow(function* (file?: File) {
        if (!file) {
          return null;
        }

        const fileResponse: UploadFileResponse = yield self.fileRequest.send(
          api.mediaRepository.uploadAudio,
          {file: file}
        );

        return fileResponse?.hash || null;
      }),
      uploadPlugin: flow(function* (file?: File) {
        if (!file) {
          return null;
        }

        const fileResponse: UploadFileResponse = yield self.fileRequest.send(
          api.mediaRepository.uploadPlugin,
          {file: file}
        );

        return fileResponse?.hash || null;
      })
    }))
    .actions((self) => ({
      uploadImageByUrl: flow(function* (url: string) {
        const file = yield getFileFromUrl(url, 'image.jpg');
        return self.uploadImageOrVideo(file, false);
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.fileRequest.isPending;
      }
    }))
);

export {MediaUploader};
