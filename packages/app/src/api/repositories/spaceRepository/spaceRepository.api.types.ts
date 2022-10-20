import {SpaceTypeEnum} from '@momentum-xyz/core';

export interface SpaceRequest {
  worldId: string;
  spaceId: string;
}

export interface SpaceInfoInterface {
  id: string;
  parentId?: string;
  spaceType: SpaceTypeEnum;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isAdmin: boolean;
}

export interface SpaceInterface extends SpaceInfoInterface {
  uiTypeId: string;
  isMember: boolean;
  isOwner: boolean;
  metadata?: {
    kusama_metadata?: {
      operator_id?: string;
    };
  };
}

export interface SpaceAncestorInterface {
  spaceId: string;
  spaceName: string;
}

export interface SubSpaceInterface {
  id: string;
  name: string;
  description: string;
  type: SpaceTypeEnum;
  subSpaces: {
    id: string;
    name: string;
    description: string;
    type: SpaceTypeEnum;
    hasSubSpaces: boolean;
  }[];
}

export interface PluginInterface {
  name: string;
  title: string;
  subTitle?: string;
  scriptUrl: string;
  iconName?: string;
}

// GET SPACE

export interface GetSpaceRequest extends SpaceRequest {}

export interface GetSpaceResponse extends SpaceInterface {}

// GET SPACE ANCESTORS

export interface GetSpaceAncestorsRequest extends SpaceRequest {}

export interface GetSpaceAncestorsResponse extends Array<SpaceAncestorInterface> {}

// SEARCH SPACES

export interface SearchSpacesRequest extends SpaceRequest {
  q: string;
}

export interface SearchSpacesResponse extends SubSpaceInterface {}

// INVITE USER

export interface InviteUserRequest extends SpaceRequest {
  userId: string;
}

export interface InviteUserResponse {}

// GET SPACE PLUGIN LIST

export interface GetSpacePluginListRequest extends SpaceRequest {
  userId: string;
}

export interface GetSpacePluginListResponse extends Array<PluginInterface> {}
