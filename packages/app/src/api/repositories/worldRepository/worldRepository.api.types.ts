export interface SpaceWithSubspacesInterface {
  id: string;
  name: string;
  description: string | null;
  subSpaces: Array<SubSpaceInterface>;
}

export interface SubSpaceInterface {
  id: string;
  name: string;
  hasSubSpaces: boolean;
}

/** Get space with subspaces (1 level of subspaces **/

export interface GetSpaceWithSubSpacesRequest {
  spaceId: string;
  worldId: string;
}

export interface GetSpaceWithSubSpacesResponse extends SpaceWithSubspacesInterface {}
