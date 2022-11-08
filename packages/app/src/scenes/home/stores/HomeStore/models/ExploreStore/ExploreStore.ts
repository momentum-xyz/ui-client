import {cast, flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {api, GetSpaceWithSubSpacesResponse, ExploreResponse} from 'api';
import {SearchQuery} from 'core/models';
import {bytesToUuid} from 'core/utils';

import {SpaceDetails, SpaceListByCategory, NavigationHistory} from './models';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      worldId: '',
      isExpanded: true,
      spaceDetails: types.maybeNull(SpaceDetails),
      searchResults: types.optional(types.array(SpaceListByCategory), []),
      searchQuery: types.optional(SearchQuery, {}),
      history: types.optional(NavigationHistory, {})
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
    selectSpace(spaceId: string): void {
      self.history.addSpaceToHistory(self.spaceDetails);
      this.loadSpace(spaceId);
    },

    goBackToPreviousSpace(): void {
      const spaceId = self.history.goBackToPreviousSpace();
      if (spaceId) {
        this.loadSpace(spaceId);
      }
    },
    loadSpace: flow(function* (spaceId: string) {
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
    // TODO: To be refactored next PR
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
