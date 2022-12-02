import {cast, flow, types} from 'mobx-state-tree';
import {ResetModel} from '@momentum-xyz/core';

import {SearchQuery} from 'core/models';
import {api, GetSpaceWithSubSpacesResponse, SearchSpacesResponse} from 'api';

import {SpaceDetails, SpaceListByCategory, NavigationHistory} from './models';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      worldId: '',
      isExpanded: false,
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
          subSpaces:
            response.subSpaces?.map((subSpace) => ({
              ...subSpace,
              hasSubspaces: !!subSpace.subSpaces?.length
            })) || []
        });
      }
    }),
    search: flow(function* () {
      self.searchResults = cast([]);

      const response: SearchSpacesResponse = yield self.searchQuery.request.send(
        api.worldRepository.searchSpaces,
        {
          query: self.searchQuery.query,
          worldId: self.worldId
        }
      );

      if (response) {
        self.searchResults = cast(
          Object.entries(response).map(([name, spaceList]) => ({
            name: name,
            spaceList: spaceList.map((space) => ({
              id: space.id,
              name: space.name,
              hasSubspaces: false
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
