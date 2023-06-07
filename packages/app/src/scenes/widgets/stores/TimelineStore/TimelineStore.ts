import {flow, types} from 'mobx-state-tree';
import {PostTypeEnum, RequestModel, ResetModel} from '@momentum-xyz/core';
import {PostFormInterface} from '@momentum-xyz/ui-kit';

import {api, UploadFileResponse} from 'api';

const TimelineStore = types.compose(
  ResetModel,
  types
    .model('TimelineStore', {
      fileRequest: types.optional(RequestModel, {}),
      request: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      // TODO: Pagination
      fetch: flow(function* (objectId: string) {
        // TODO
      }),
      create: flow(function* (form: PostFormInterface, type: PostTypeEnum, objectId: string) {
        // TODO: Remove. Disabling EP calls
        if (!form.file || form.file) {
          return false;
        }

        // 1. File uploading
        const fileResponse: UploadFileResponse = yield self.fileRequest.send(
          type === PostTypeEnum.VIDEO
            ? api.mediaRepository.uploadVideo
            : api.mediaRepository.uploadImage,
          {file: form.file}
        );

        if (!fileResponse?.hash) {
          return false;
        }

        // remove
        if (fileResponse?.hash) {
          return true;
        }

        // 2. Item creating
        yield self.request.send(api.timelineRepository.createTimeline, {
          objectId,
          type,
          data: {
            render_hash: fileResponse?.hash,
            description: form.description || ''
          }
        });

        return self.request.isDone && self.fileRequest.isDone;
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.request.isPending || self.fileRequest.isPending;
      }
    }))
);

export {TimelineStore};
