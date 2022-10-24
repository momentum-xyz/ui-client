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
      searchedSpacesByCategory: types.optional(types.array(SpaceListByCategory), []),
      spaceHistory: types.optional(types.array(SpaceInfo), []),
      previousItem: types.maybe(SpaceInfo)
    })
  )
  .actions((self) => ({
    toggleExpand(isExpanded: boolean) {
      self.isExpanded = isExpanded;
    },
    selectSpace(spaceId: string) {
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
    goBack() {
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
    unselectSpace() {
      self.selectedSpace = undefined;
    },
    setSearchQuery(query: string) {
      self.searchQuery = query;
    },
    search: flow(function* (query: string, worldId: string) {
      const response: ExploreResponse = yield self.searchRequest.send(
        api.spaceTypeRepository.searchExplore,
        {
          searchQuery: query,
          worldId
        }
      );

      if (response) {
        self.searchedSpacesByCategory = cast(
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
    get isSearching() {
      return self.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT;
    }
  }));

export {ExploreStore};
