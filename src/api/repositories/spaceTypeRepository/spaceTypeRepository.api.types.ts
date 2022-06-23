/** Fetch allowed space types **/

import {SpaceInterface} from '../spaceRepository/spaceRepository.api.types';

export interface CategoryInterface {
  name: string;
  spaces: SpaceInterface[];
}

export interface GetAllowedSpaceTypesRequest {
  spaceId: string;
}

export interface GetAllowedSpaceTypesResponse extends Array<string> {}

export interface ExploreRequest {
  searchQuery?: string;
  worldId: string;
  spaceId?: string;
}

export interface ExploreResponse extends Array<CategoryInterface> {}
