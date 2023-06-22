import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {PostFormInterface} from '@momentum-xyz/ui-kit';
import {
  ActivityUpdateEnum,
  Event3dEmitter,
  TimelineTypeEnum,
  RequestModel,
  ResetModel
} from '@momentum-xyz/core';

import {PluginIdEnum} from 'api/enums';
import {api, FetchTimelineResponse, TimelineItemInterface} from 'api';
import {
  MediaUploader,
  TimelineEntry,
  TimelineEntryModelInterface,
  TimelineEntryDataModelInterface
} from 'core/models';

const PAGE_SIZE = 5;

const TimelineStore = types.compose(
  ResetModel,
  types
    .model('TimelineStore', {
      userId: '',
      worldId: '',
      isTimelineShown: false,
      isCreationShown: false,
      mediaUploader: types.optional(MediaUploader, {}),
      entries: types.optional(types.array(TimelineEntry), []),
      itemCount: types.optional(types.number, 0),

      hasUpdates: false,

      itemRequest: types.optional(RequestModel, {}),
      createRequest: types.optional(RequestModel, {}),
      updateRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {}),
      entriesRequest: types.optional(RequestModel, {}),
      lastSeenRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      addEntity(entity: TimelineItemInterface): void {
        if (!self.entries.find((e) => e.activity_id === entity.activity_id)) {
          const targetIndex = self.isCreationShown ? 1 : 0;
          self.entries.splice(targetIndex, 0, entity);
          self.itemCount = self.itemCount + 1;
        }
      },
      changeEntity(id: string, data: TimelineEntryDataModelInterface): void {
        const storeEntry = self.entries.find((e) => e.activity_id === id);
        if (storeEntry) {
          storeEntry.data = data;
        }
      },
      deleteEntity(id: string): void {
        if (self.entries.find((e) => e.activity_id === id)) {
          self.entries = cast(self.entries.filter((e) => e.activity_id !== id));
          self.itemCount = self.itemCount - 1;
        }
      }
    }))
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
              type: TimelineTypeEnum.SCREENSHOT,
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
        postType: TimelineTypeEnum,
        objectId: string
      ) {
        const isVideo = postType === TimelineTypeEnum.VIDEO;
        const hash = yield self.mediaUploader.uploadImageOrVideo(form.file, isVideo);

        if (!hash) {
          return false;
        }

        const response: TimelineItemInterface = yield self.createRequest.send(
          api.timelineRepository.createItem,
          {
            type: postType,
            hash,
            objectId,
            description: form.description || ''
          }
        );

        if (response) {
          self.addEntity(response);
        }

        return self.createRequest.isDone && self.mediaUploader.fileRequest.isDone;
      }),
      updateItem: flow(function* (
        form: PostFormInterface,
        entry: TimelineEntryModelInterface,
        objectId: string
      ) {
        const isVideo = entry.type === TimelineTypeEnum.VIDEO;
        const hash = yield self.mediaUploader.uploadImageOrVideo(form.file, isVideo);

        yield self.updateRequest.send(api.timelineRepository.updateItem, {
          objectId,
          id: entry.activity_id,
          type: entry.type,
          hash: hash || entry.data.hash,
          description: form.description || ''
        });

        if (self.updateRequest.isDone) {
          self.changeEntity(entry.activity_id, {
            hash: hash || entry.data.hash,
            description: form.description || '',
            token_amount: null,
            token_symbol: null
          });
        }

        return self.updateRequest.isDone;
      }),
      deleteItem: flow(function* (entry: TimelineEntryModelInterface, objectId: string) {
        const id = entry.activity_id;

        yield self.deleteRequest.send(api.timelineRepository.deleteItem, {objectId, id});
        if (self.deleteRequest.isDone) {
          self.deleteEntity(id);
        }

        return self.deleteRequest.isDone;
      })
    }))
    .actions((self) => ({
      checkLastSeenDate: flow(function* () {
        /* 1. GETTING LAST SEEN DATE */
        const attributeResponse = yield self.lastSeenRequest.send(
          api.spaceUserAttributeRepository.getSpaceUserAttribute,
          {
            spaceId: self.worldId,
            userId: self.userId,
            pluginId: PluginIdEnum.CORE,
            attributeName: AttributeNameEnum.TIMELINE_LAST_SEEN
          }
        );

        /* 2. GETTING DATE OF A LAST ITEM */
        const timelineResponse: FetchTimelineResponse = yield self.entriesRequest.send(
          api.timelineRepository.fetchTimeline,
          {
            startIndex: 0,
            pageSize: 1,
            objectId: self.worldId
          }
        );

        /* 3. SETTING VALUE FOR 'self.hasUpdates' IF IT NEEDS  */
        const lastSeenDateString = attributeResponse?.lastSeenDate;
        const lastItemDateString = timelineResponse?.activities[0]?.created_at;

        // There is at least 1 item and user have never seen the timeline
        if (lastItemDateString && !lastSeenDateString) {
          self.hasUpdates = true;
          return;
        }

        // There is at least 1 new item
        if (lastItemDateString && lastSeenDateString) {
          const lastItemDate = new Date(lastItemDateString).getTime();
          const lastSeenDate = new Date(lastSeenDateString).getTime();

          if (lastItemDate > lastSeenDate) {
            self.hasUpdates = true;
            return;
          }
        }
      }),
      updateLastSeenDate: flow(function* () {
        yield self.lastSeenRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
          spaceId: self.worldId,
          userId: self.userId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.TIMELINE_LAST_SEEN,
          value: {lastSeenDate: new Date().toISOString()}
        });
      })
    }))
    .actions((self) => ({
      open(isGuest: boolean): void {
        self.isCreationShown = !isGuest;
        self.isTimelineShown = true;
        self.hasUpdates = false;
        self.updateLastSeenDate();
      },
      close(): void {
        self.isCreationShown = false;
        self.isTimelineShown = false;
        self.hasUpdates = false;
        self.entries = cast([]);
        self.itemCount = 0;
        self.updateLastSeenDate();
      },
      onActivityUpdate: flow(function* (activityId: string, updateType: ActivityUpdateEnum) {
        switch (updateType) {
          case ActivityUpdateEnum.NEW:
            console.log('[TimelineStore] NEW', activityId);
            if (self.isTimelineShown) {
              const response = yield self.itemRequest.send(api.timelineRepository.fetchItem, {
                objectId: self.worldId,
                id: activityId
              });

              if (response) {
                self.addEntity(response);
              }
            } else {
              self.hasUpdates = true;
            }
            break;
          case ActivityUpdateEnum.CHANGED:
            console.log('[TimelineStore] CHANGED', activityId);
            if (self.isTimelineShown) {
              const response = yield self.itemRequest.send(api.timelineRepository.fetchItem, {
                objectId: self.worldId,
                id: activityId
              });

              if (response) {
                self.changeEntity(activityId, response.data);
              }
            }
            break;
          case ActivityUpdateEnum.REMOVED:
            console.log('[TimelineStore] REMOVED', activityId);
            if (self.isTimelineShown) {
              self.deleteEntity(activityId);
            }
            break;
          default:
            console.log('[TimelineStore] Unknown activity type');
            break;
        }
      })
    }))
    .actions((self) => ({
      initAndSubscribe(worldId: string, userId: string): void {
        self.userId = userId;
        self.worldId = worldId;
        self.checkLastSeenDate();
        this.subscribe();
      },
      subscribe(): void {
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
