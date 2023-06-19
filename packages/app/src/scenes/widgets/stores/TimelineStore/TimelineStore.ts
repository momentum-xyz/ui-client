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
      isCreationShown: false,

      createRequest: types.optional(RequestModel, {}),
      updateRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {}),
      entriesRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      init(isGuest: boolean): void {
        self.isCreationShown = !isGuest;
      },
      loadMore: flow(function* (objectId: string, startIndex: number) {
        const response: FetchTimelineResponse = yield self.entriesRequest.send(
          api.timelineRepository.fetchTimeline,
          {
            startIndex: startIndex !== 0 && self.isCreationShown ? startIndex - 1 : startIndex,
            pageSize: PAGE_SIZE,
            objectId
          }
        );

        // Dummy entry for the creation form
        if (startIndex === 0 && self.isCreationShown) {
          self.entries = cast([
            {
              activity_id: '',
              created_at: '',
              object_id: '',
              world_name: '',
              user_id: '',
              user_name: '',
              avatar_hash: '',
              type: PostTypeEnum.SCREENSHOT,
              data: {
                hash: '',
                description: ''
              }
            }
          ]);
        }

        if (response) {
          self.entries = cast([...self.entries, ...response.activities]);

          // We should add one item for rendering the creation form
          const totalCount = self.isCreationShown ? response.totalCount + 1 : response.totalCount;

          // Value of itemCount should be equal to count of loaded times + 1.
          // It allows us to load pages one by one.
          const noMoreItems = self.entries.length >= totalCount;
          self.itemCount = noMoreItems ? totalCount : self.entries.length + 1;
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
        if (self.deleteRequest.isDone) {
          self.entries = cast(self.entries.filter((e) => e.activity_id !== id));
        }

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
