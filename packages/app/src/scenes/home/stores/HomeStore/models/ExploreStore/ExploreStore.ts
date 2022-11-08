import {cast, flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {api, GetSpaceWithSubSpacesResponse, ExploreResponse} from 'api';
import {SearchQuery, SpaceInfo} from 'core/models';
import {bytesToUuid} from 'core/utils';

import {SpaceDetails, SpaceListByCategory} from './models';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      worldId: '',
      isExpanded: true,
      spaceDetails: types.maybeNull(SpaceDetails),
      searchResults: types.optional(types.array(SpaceListByCategory), []),
      searchQuery: types.optional(SearchQuery, {}),
      spaceHistory: types.optional(types.array(SpaceInfo), []),
      previousSpace: types.maybeNull(SpaceInfo)
    })
  )
  .actions((self) => ({
    init(worldId: string): void {
      self.worldId = worldId;
      this.selectSpace(worldId);
    },
    setExpand(isExpanded: boolean): void {
      self.isExpanded = isExpanded;
    },
    selectSpace: flow(function* (spaceId: string) {
      if (self.previousSpace) {
        self.spaceHistory.push({...self.previousSpace});
      }

      if (self.spaceDetails && self.spaceDetails.name) {
        self.previousSpace = cast({
          id: self.spaceDetails.id,
          name: self.spaceDetails.name
        });
      }

      self.searchQuery.resetModel();
      self.spaceDetails = null;

      const response: GetSpaceWithSubSpacesResponse = yield self.searchQuery.request.send(
        api.worldRepository.fetchSpaceWithSubSpaces,
        {
          worldId: self.worldId,
          spaceId: spaceId
        }
      );

      if (response) {
        self.spaceDetails = cast({
          ...response,
          subSpaces: response.subSpaces.map((subSpace) => ({
            ...subSpace,
            hasSubspaces: !!subSpace.subSpaces.length
          }))
        });
      }
    }),
    goBack(): void {
      const previousItem = self.spaceHistory.pop();
      const previousItemId = self.previousSpace?.id;

      if (!previousItemId) {
        return;
      }

      if (previousItem) {
        self.previousSpace = {...previousItem};
      } else {
        self.previousSpace = null;
      }
    },
    search: flow(function* () {
      self.searchResults = cast([]);
      const response: ExploreResponse = yield self.searchQuery.request.send(
        api.spaceTypeRepository.searchExplore,
        {
          searchQuery: self.searchQuery.query,
          worldId: self.worldId
        }
      );

      if (response) {
        self.searchResults = cast(
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
      return self.searchQuery.isPending;
    }
  }));

export {ExploreStore};
