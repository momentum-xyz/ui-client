import {cast, flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {api} from 'api';
import {SpaceInfo, SearchQuery} from 'core/models';
import {ExploreResponse} from 'api';
import {bytesToUuid} from 'core/utils';
// FIXME: Removal
import {SpaceStore} from 'scenes/collaboration/stores/SpaceStore';

import {SpaceListByCategory} from './models';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      isExpanded: true,
      // TODO: Use SpaceInfo model
      selectedSpace: types.maybe(SpaceStore),
      spaceList: types.optional(types.array(SpaceListByCategory), []),
      searchQuery: types.optional(SearchQuery, {}),
      spaceHistory: types.optional(types.array(SpaceInfo), []),
      previousItem: types.maybe(SpaceInfo)
    })
  )
  .actions((self) => ({
    setExpand(isExpanded: boolean): void {
      self.isExpanded = isExpanded;
    },
    selectSpace(spaceId: string): void {
      self.searchQuery.setQuery('');

      if (self.previousItem) {
        self.spaceHistory.push({...self.previousItem});
      }

      if (self.selectedSpace && self.selectedSpace.name) {
        self.previousItem = cast({
          id: self.selectedSpace.id,
          name: self.selectedSpace.name
        });
      }

      self.selectedSpace = SpaceStore.create({id: spaceId});
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

      self.selectedSpace = SpaceStore.create({id: previousItemId});
      self.selectedSpace.fetchSpaceInformation();
    },
    search: flow(function* (worldId: string) {
      self.spaceList = cast([]);
      const response: ExploreResponse = yield self.searchQuery.request.send(
        api.spaceTypeRepository.searchExplore,
        {
          searchQuery: self.searchQuery.query,
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
    get isLoading(): boolean {
      return self.searchQuery.isPending || !!self.selectedSpace?.isPending;
    }
  }));

export {ExploreStore};
