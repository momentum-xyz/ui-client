import {cast, flow, types} from 'mobx-state-tree';
import {
  ActivityUpdateEnum,
  Event3dEmitter,
  PostTypeEnum,
  RequestModel,
  ResetModel
} from '@momentum-xyz/core';
import {PostFormInterface} from '@momentum-xyz/ui-kit';

import {MediaUploader, TimelineEntry, TimelineEntryModelInterface} from 'core/models';
import {api, FetchTimelineResponse} from 'api';

const PAGE_SIZE = 5;

const TimelineStore = types.compose(
  ResetModel,
  types
    .model('TimelineStore', {
      worldId: '',
      isTimelineShown: false,
      isCreationShown: false,
      mediaUploader: types.optional(MediaUploader, {}),
      entries: types.optional(types.array(TimelineEntry), []),
      itemCount: types.optional(types.number, 0),

      hasUpdates: false,

      createRequest: types.optional(RequestModel, {}),
      updateRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {}),
      entriesRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      loadMore: flow(function* (startIndex: number) {
        const response: FetchTimelineResponse = yield self.entriesRequest.send(
          api.timelineRepository.fetchTimeline,
          {
            startIndex: startIndex !== 0 && self.isCreationShown ? startIndex - 1 : startIndex,
            pageSize: PAGE_SIZE,
            objectId: self.worldId
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

        const response = yield self.createRequest.send(api.timelineRepository.createItem, {
          type: postType,
          hash,
          objectId,
          description: form.description || ''
        });

        if (response) {
          // TODO: Add item to the list
        }

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
    .actions((self) => ({
      init(isGuest: boolean): void {
        self.isCreationShown = !isGuest;
        self.isTimelineShown = true;
        self.hasUpdates = false;
      },
      deInit(): void {
        self.isCreationShown = false;
        self.isTimelineShown = false;
        self.hasUpdates = false;
        self.entries = cast([]);
        self.itemCount = 0;
      },
      onActivityUpdate(activityId: string, updateType: ActivityUpdateEnum): void {
        switch (updateType) {
          case ActivityUpdateEnum.NEW:
            console.log('[TimelineStore] NEW', activityId);
            // TODO
            break;
          case ActivityUpdateEnum.CHANGED:
            console.log('[TimelineStore] CHANGED', activityId);
            // TODO
            break;
          case ActivityUpdateEnum.REMOVED:
            console.log('[TimelineStore] REMOVED', activityId);
            // TODO
            break;
          default:
            console.log('[TimelineStore] Unknown activity type');
            break;
        }
      }
    }))
    .actions((self) => ({
      subscribe(worldId: string): void {
        self.worldId = worldId;
        Event3dEmitter.on('ActivityUpdate', self.onActivityUpdate);
        console.log('[TimelineStore] Subscribe to activity', self.worldId);
      },
      unsubscribe(): void {
        Event3dEmitter.off('ActivityUpdate', self.onActivityUpdate);
        console.log('[TimelineStore] Unsubscribe from activity', self.worldId);
      }
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
