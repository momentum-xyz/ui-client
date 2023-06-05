import {flow, types} from 'mobx-state-tree';
import {PostTypeEnum, RequestModel, ResetModel} from '@momentum-xyz/core';
import {PostFormInterface} from '@momentum-xyz/ui-kit';

import {api, UploadImageResponse} from 'api';

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
        if (!form.file || !form.description) {
          return false;
        }

        // 1. File uploading
        const data = {file: form.file};
        const fileResponse: UploadImageResponse = yield self.fileRequest.send(
          api.mediaRepository.uploadImage,
          data
        );

        if (!fileResponse?.hash) {
          return false;
        }

        // 2. Item creating
        yield self.request.send(api.timelineRepository.createTimeline, {
          objectId,
          type,
          data: {
            render_hash: fileResponse?.hash,
            description: form.description
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
