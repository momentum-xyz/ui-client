import {types, flow, cast} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {api, BaseFavoritesResponse, FetchFavoritesResponse, PostFavoriteResponse} from 'api';

const FavoriteModel = types.model({
  spaceId: types.string,
  name: types.string
});

const FavoriteStore = types.compose(
  ResetModel,
  types
    .model('FavoriteStore', {
      request: types.optional(RequestModel, {}),
      addFavoriteRequest: types.optional(RequestModel, {}),
      removeFavoriteRequest: types.optional(RequestModel, {}),
      favorites: types.array(FavoriteModel),
      spaceId: types.optional(types.string, '')
    })
    .actions((self) => ({
      fetchFavorites: flow(function* () {
        const favoritesResponse: FetchFavoritesResponse = yield self.request.send(
          api.favoriteRepository.fetchFavorites,
          {}
        );

        if (favoritesResponse) {
          self.favorites = cast(
            favoritesResponse.map((favorite) => ({
              spaceId: favorite.spaceId,
              name: favorite.name
            }))
          );
        }
      }),
      addFavorite: flow(function* (spaceId: string) {
        //check

        const response: PostFavoriteResponse = yield self.addFavoriteRequest.send(
          api.favoriteRepository.postFavorite,
          {
            spaceId
          }
        );

        if (response) {
          self.favorites.push(cast({spaceId: response.spaceId, name: response.name}));
        }
      }),

      removeFavorite: flow(function* (spaceId: string) {
        const response: BaseFavoritesResponse = yield self.removeFavoriteRequest.send(
          api.favoriteRepository.deleteFavorite,
          {
            spaceId
          }
        );

        if (response) {
          self.favorites.splice(
            self.favorites.findIndex((item) => item.spaceId === spaceId),
            1
          );
        }
      }),
      setSpaceId(spaceId: string) {
        self.spaceId = spaceId;
      }
    }))
    .views((self) => ({
      get isSpaceFavorite() {
        return !!self.favorites.find((favorite) => favorite.spaceId === self.spaceId);
      },
      isFavorite(spaceId) {
        return !!self.favorites.find((favorite) => favorite.spaceId === spaceId);
      }
    }))
);

export {FavoriteStore};
