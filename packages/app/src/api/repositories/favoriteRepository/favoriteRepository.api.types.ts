/** COMMON **/

/** Favorites **/
export interface FavoritesInterface {
  spaceId: string;
  name: string;
}

export interface BaseFavoritesRequest {}

export interface PostFavoritesRequest {
  spaceId: string;
}

export interface DeleteFavoritesRequest {
  spaceId: string;
}

export interface BaseFavoritesResponse {}

export interface PostFavoriteResponse extends FavoritesInterface {}

export interface FetchFavoritesResponse extends Array<FavoritesInterface> {}
