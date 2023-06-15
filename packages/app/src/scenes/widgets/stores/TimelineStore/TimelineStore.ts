import {cast, flow, types} from 'mobx-state-tree';
import {PostTypeEnum, RequestModel, ResetModel} from '@momentum-xyz/core';
import {PostFormInterface} from '@momentum-xyz/ui-kit';

import {MediaUploader, TimelineEntry, TimelineEntryModelInterface} from 'core/models';
import {api, FetchTimelineResponse} from 'api';

const PAGE_SIZE = 5;

const TimelineStore = types.compose(
  ResetModel,
  types
    .model('TimelineStore', {
      mediaUploader: types.optional(MediaUploader, {}),
      entries: types.optional(types.array(TimelineEntry), []),
      itemCount: types.optional(types.number, 0),

      createRequest: types.optional(RequestModel, {}),
      updateRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {}),
      entriesRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      loadMore: flow(function* (objectId: string, startIndex: number) {
        //yield new Promise((res) => setTimeout(res, 3000));

        const response: FetchTimelineResponse = yield self.entriesRequest.send(
          api.timelineRepository.fetchTimeline,
          {
            startIndex: startIndex,
            pageSize: PAGE_SIZE,
            objectId
          }
        );

        if (response) {
          self.entries = cast([...self.entries, ...response.activities]);

          // FYI:
          // Value of itemCount should be equal to count of loaded times + 1.
          // It allows us to load pages one by one.
          const noMoreItems = self.entries.length >= response.totalCount;
          self.itemCount = noMoreItems ? response.totalCount : self.entries.length + 1;
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
      }),
      deleteItem: flow(function* (entry: TimelineEntryModelInterface, objectId: string) {
        const id = entry.activity_id;
        yield self.deleteRequest.send(api.timelineRepository.deleteItem, {objectId, id});

        return self.deleteRequest.isDone;
      })
    }))
    .views((self) => ({
      get entityList() {
        return [...self.entries];
      },
      get isPending(): boolean {
        return (
          self.createRequest.isPending ||
          self.updateRequest.isPending ||
          self.deleteRequest.isPending ||
          self.mediaUploader.fileRequest.isPending
        );
      }
    }))
);

export {TimelineStore};
