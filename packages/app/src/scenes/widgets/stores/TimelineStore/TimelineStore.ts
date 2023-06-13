import {cast, flow, types} from 'mobx-state-tree';
import {PostTypeEnum, RequestModel, ResetModel} from '@momentum-xyz/core';
import {PostFormInterface} from '@momentum-xyz/ui-kit';

import {MediaUploader, TimelineEntry, TimelineEntryModelInterface} from 'core/models';
import {api, FetchTimelineResponse} from 'api';

const TimelineStore = types.compose(
  ResetModel,
  types
    .model('TimelineStore', {
      mediaUploader: types.optional(MediaUploader, {}),
      createRequest: types.optional(RequestModel, {}),
      updateRequest: types.optional(RequestModel, {}),
      entriesRequest: types.optional(RequestModel, {}),
      entries: types.optional(types.array(TimelineEntry), [])
    })
    .actions((self) => ({
      // TODO: Pagination
      fetch: flow(function* (objectId: string) {
        const response: FetchTimelineResponse = yield self.entriesRequest.send(
          api.timelineRepository.fetchTimeline,
          {
            page: 1,
            pageSize: 10000,
            objectId
          }
        );

        if (response) {
          self.entries = cast(response.activities);
        }
      }),
      createItem: flow(function* (
        form: PostFormInterface,
        postType: PostTypeEnum,
        objectId: string
      ) {
        const isVideo = postType === PostTypeEnum.VIDEO;
        const hash = yield self.mediaUploader.uploadImageOrVideo(form.file, isVideo);

        if (!hash) {
          return false;
        }

        yield self.createRequest.send(api.timelineRepository.createItem, {
          type: postType,
          hash,
          objectId,
          description: form.description || ''
        });

        return self.createRequest.isDone && self.mediaUploader.fileRequest.isDone;
      }),
      updateItem: flow(function* (
        form: PostFormInterface,
        entry: TimelineEntryModelInterface,
        objectId: string
      ) {
        const isVideo = entry.type === PostTypeEnum.VIDEO;
        const hash = yield self.mediaUploader.uploadImageOrVideo(form.file, isVideo);

        yield self.updateRequest.send(api.timelineRepository.updateItem, {
          objectId,
          id: entry.activity_id,
          type: entry.type,
          hash: hash || entry.data.hash,
          description: form.description || ''
        });

        if (self.updateRequest.isDone) {
          const storeEntry = self.entries.find((e) => e.activity_id === entry.activity_id);
          if (storeEntry) {
            storeEntry.data.hash = hash || entry.data.hash;
            storeEntry.data.description = form.description || '';
          }
        }

        return self.updateRequest.isDone;
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return (
          self.createRequest.isPending ||
          self.updateRequest.isPending ||
          self.mediaUploader.fileRequest.isPending
        );
      }
    }))
);

export {TimelineStore};
