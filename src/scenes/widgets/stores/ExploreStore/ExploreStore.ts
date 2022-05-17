import {cast, flow, Instance, types} from 'mobx-state-tree';

import {RequestModel, ResetModel, SpaceModel} from 'core/models';
import {SpaceStore} from 'stores/MainStore/models';
import {api, SearchSpacesResponse} from 'api';
import {bytesToUuid} from 'core/utils';

const ExploreStore = types
  .compose(
    ResetModel,
    types.model('ExploreStore', {
      worldSpaceStore: types.optional(SpaceStore, {}),
      selectedSpaceStore: types.optional(SpaceStore, {}),
      isExpanded: true,
      searchRequest: types.optional(RequestModel, {}),
      searchQuery: '',
      searchedSpaces: types.optional(types.array(types.optional(SpaceModel, {})), [])
    })
  )
  .actions((self) => ({
    fetchWorldInformation(worldId: string) {
      self.worldSpaceStore.setSpace(worldId);
      self.worldSpaceStore.fetchSpaceInformation();
    },
    toggleExpand(isExpanded: boolean) {
      self.isExpanded = isExpanded;
    },
    selectSpace(spaceId: string) {
      self.selectedSpaceStore.setSpace(spaceId);
      self.selectedSpaceStore.fetchSpaceInformation();
    },
    unselectSpace() {
      self.selectedSpaceStore.resetModel();
    },
    setSearchQuery(query: string) {
      self.searchQuery = query;
    },
    search: flow(function* (query: string, worldId: string) {
      const response: SearchSpacesResponse = yield self.searchRequest.send(
        api.spaceRepository.searchSpaces,
        {
          q: query,
          worldId
        }
      );

      if (response) {
        self.searchedSpaces = cast(
          response.results.map((item) => ({...item, id: bytesToUuid(item.id.data)}))
        );
      }
    })
  }));

export interface ExploreStoreInterface extends Instance<typeof ExploreStore> {}

export {ExploreStore};
