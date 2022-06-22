import {cast, flow, Instance, types} from 'mobx-state-tree';

import {RequestModel, ResetModel, SpaceModelInterface} from 'core/models';
import {SpaceStore} from 'stores/MainStore/models';
import {api} from 'api';
import {SEARCH_MINIMAL_CHARACTER_COUNT} from 'core/constants';
import {ExploreResponse} from 'api/repositories/spaceTypeRepository/spaceTypeRepository.api.types';
import {bytesToUuid} from 'core/utils';

import {ExploreCategoryModel, SpaceHistoryItemModel} from './models';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      selectedSpaceStore: types.optional(SpaceStore, {}),
      isExpanded: true,
      searchRequest: types.optional(RequestModel, {}),
      searchQuery: '',
      searchedSpacesByCategory: types.optional(types.array(ExploreCategoryModel), []),
      spaceHistory: types.optional(types.array(SpaceHistoryItemModel), []),
      previousItem: types.maybe(SpaceHistoryItemModel)
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

      if (self.selectedSpaceStore.space.name && self.selectedSpaceStore.space.id) {
        self.previousItem = cast({
          spaceName: self.selectedSpaceStore.space.name,
          spaceId: self.selectedSpaceStore.space.id
        });
      }

      self.selectedSpaceStore.setSpace(spaceId);
      self.selectedSpaceStore.fetchSpaceInformation();
    },
    goBack() {
      const previousItem = self.spaceHistory.pop();
      const previousItemId = self.previousItem?.spaceId;

      if (!previousItemId) {
        return;
      }

      if (previousItem) {
        self.previousItem = {...previousItem};
      } else {
        self.previousItem = undefined;
      }

      self.selectedSpaceStore.setSpace(previousItemId);
      self.selectedSpaceStore.fetchSpaceInformation();
    },
    unselectSpace() {
      self.selectedSpaceStore.resetModel();
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
            ...category,
            spaces: category.spaces.map((space) => ({
              ...space,
              id: bytesToUuid(space.id.data)
            }))
          }))
        );
      }
    })
  }))
  .views((self) => ({
    get selectedSpace(): SpaceModelInterface | undefined {
      if (!self.selectedSpaceStore.space.id) {
        return undefined;
      }

      return self.selectedSpaceStore.space;
    },
    get isSearching() {
      return self.searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT;
    }
  }));

export interface ExploreStoreInterface extends Instance<typeof ExploreStore> {}

export {ExploreStore};
