import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, FetchNewsfeedResponse} from 'api';
import {TimelineEntry} from 'core/models';

const PAGE_SIZE = 5;

const NewsfeedStore = types.compose(
  ResetModel,
  types
    .model('NewsfeedStore', {
      isNewsfeedShown: false,
      entries: types.optional(types.array(TimelineEntry), []),
      itemCount: types.optional(types.number, 0),
      entriesRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      loadMore: flow(function* (startIndex: number) {
        const response: FetchNewsfeedResponse = yield self.entriesRequest.send(
          api.newsfeedRepository.fetchNewsfeed,
          {
            startIndex,
            pageSize: PAGE_SIZE
          }
        );

        if (response) {
          self.entries = cast([...self.entries, ...response.activities]);

          const totalCount = response.totalCount;
          const noMoreItems = self.entries.length >= totalCount;
          self.itemCount = noMoreItems ? totalCount : self.entries.length + 1;
        }
      })
    }))
    .actions((self) => ({
      open(): void {
        self.isNewsfeedShown = true;
      },
      close(): void {
        self.isNewsfeedShown = false;
        self.entries = cast([]);
        self.itemCount = 0;
      }
    }))
    .views((self) => ({
      get entityList() {
        return [...self.entries];
      }
    }))
);

export {NewsfeedStore};
