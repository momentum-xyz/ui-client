import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {SEARCH_MINIMAL_CHARACTER_COUNT} from '@momentum-xyz/ui-kit';

import {api} from 'api';
import {SpaceInfo, Space} from 'core/models';
import {ExploreResponse} from 'api';
import {bytesToUuid} from 'core/utils';

import {SpaceListByCategory} from './models';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      selectedSpace: types.maybe(Space),
      isExpanded: true,
      searchRequest: types.optional(RequestModel, {}),
      searchQuery: '',
      spaceList: types.optional(types.array(SpaceListByCategory), []),
      spaceHistory: types.optional(types.array(SpaceInfo), []),
      previousItem: types.maybe(SpaceInfo)
    })
  )
  .actions((self) => ({
    setExpand(isExpanded: boolean): void {
      self.isExpanded = isExpanded;
    },
    selectSpace(spaceId: string): void {
      self.searchQuery = '';

      if (self.previousItem) {
        self.spaceHistory.push({...self.previousItem});
      }

      if (self.selectedSpace && self.selectedSpace.name) {
        self.previousItem = cast({
          id: self.selectedSpace.id,
          name: self.selectedSpace.name
        });
      }

      self.selectedSpace = Space.create({id: spaceId});
      self.selectedSpace.fetchSpaceInformation();
    },
    goBack(): void {
      const previousItem = self.spaceHistory.pop();
      const previousItemId = self.previousItem?.id;

      if (!previousItemId) {
        return;
      }

      if (previousItem) {
        self.previousItem = {...previousItem};
      } else {
        self.previousItem = undefined;
      }

      self.selectedSpace = Space.create({id: previousItemId});
      self.selectedSpace.fetchSpaceInformation();
    },
    setSearchQuery(query: string): void {
      self.searchQuery = query;
    },
    search: flow(function* (worldId: string) {
      self.spaceList = cast([]);
      const response: ExploreResponse = yield self.searchRequest.send(
        api.spaceTypeRepository.searchExplore,
        {
          searchQuery: self.searchQuery,
          worldId
        }
      );

      if (response) {
        self.spaceList = cast(
          response.map((category) => ({
            name: category.name,
            spaces: category.spaces.map((space) => ({
              id: bytesToUuid(space.id.data),
              name: space.name,
              hasSubspaces: !!space.children?.length
            }))
          }))
        );
      }
    })
  }))
  .views((self) => ({
    get isSearch(): boolean {
      return self.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT;
    },
    get isLoading(): boolean {
      return self.searchRequest.isPending || !!self.selectedSpace?.isPending;
    }
  }));

export {ExploreStore};
