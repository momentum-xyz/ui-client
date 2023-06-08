import {flow, types} from 'mobx-state-tree';
import {PostTypeEnum, RequestModel, ResetModel} from '@momentum-xyz/core';
import {PostFormInterface} from '@momentum-xyz/ui-kit';

import {api, FetchTimelineResponse, UploadFileResponse} from 'api';

const TimelineStore = types.compose(
  ResetModel,
  types
    .model('TimelineStore', {
      fileRequest: types.optional(RequestModel, {}),
      createRequest: types.optional(RequestModel, {}),
      fetchRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      // TODO: Pagination
      fetch: flow(function* (objectId: string) {
        const response: FetchTimelineResponse = yield self.fetchRequest.send(
          api.timelineRepository.fetchTimeline,
          {
            page: 1,
            pageSize: 10,
            objectId
          }
        );

        console.log(response);
      }),
      create: flow(function* (form: PostFormInterface, type: PostTypeEnum, objectId: string) {
        if (!form.file) {
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

        // 2. Item creating
        yield self.createRequest.send(api.timelineRepository.createTimeline, {
          type,
          objectId,
          hash: fileResponse?.hash,
          description: form.description || ''
        });

        return self.createRequest.isDone && self.fileRequest.isDone;
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.createRequest.isPending || self.fileRequest.isPending;
      }
    }))
);

export {TimelineStore};
