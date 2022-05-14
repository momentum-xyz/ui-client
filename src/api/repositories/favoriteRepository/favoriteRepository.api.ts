import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  BaseFavoritesRequest,
  BaseFavoritesResponse,
  DeleteFavoritesRequest,
  FetchFavoritesResponse,
  PostFavoritesRequest,
  PostFavoriteResponse
} from './favoriteRepository.api.types';
import {favoriteRepositoryEndpoints} from './favoriteRepository.api.endpoints';

export const fetchFavorites: RequestInterface<BaseFavoritesRequest, FetchFavoritesResponse> = (
  options
) => {
  const {...restOptions} = options;
  return request.get(favoriteRepositoryEndpoints.base, restOptions);
};

export const postFavorite: RequestInterface<PostFavoritesRequest, PostFavoriteResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;

  return request.post(favoriteRepositoryEndpoints.base, {spaceId}, restOptions);
};

export const deleteFavorite: RequestInterface<DeleteFavoritesRequest, BaseFavoritesResponse> = (
  options
) => {
  const {spaceId, ...restOptions} = options;
  const url = favoriteRepositoryEndpoints.base + `/${spaceId}`;
  return request.delete(url, restOptions);
};
