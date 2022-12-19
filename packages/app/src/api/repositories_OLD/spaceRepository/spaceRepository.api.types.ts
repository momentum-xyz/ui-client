import {SpaceTypeEnum} from '@momentum-xyz/core';

import {MetadataFieldType} from 'core/types';

interface AuxProjectInterface {
  problem: string;
  solution: string;
}

interface UserInterface {
  name: string;
}

export interface UserEditInterface {
  userId: string;
  isAdmin: boolean;
  spaceId: string;
}

export interface UserSpaceInterface {
  user: UserInterface;
  isAdmin: boolean;
  spaceId?: {
    type: string;
    data: Buffer;
  };
  userId?: {
    type: string;
    data: Buffer;
  };
  space?: OldSpaceInterface;
}

export interface SpaceMetadataInterface {
  kusama_metadata?: {
    operator_id?: string;
  };
}

export interface OldSpaceInterface {
  id: {
    type: string;
    data: Buffer;
  };
  name: string;
  description: string;
  secret: number;
  parentId?: {
    type: string;
    data: Buffer;
  };
  userSpaces?: UserSpaceInterface[] | any[];
  children?: OldSpaceInterface[];
  createdAt?: Date;
  updatedAt?: Date;
  auxProject?: AuxProjectInterface;
  isAdmin?: string;
  ownedById?: {
    type: string;
    data: Buffer;
  };
  uiTypeId?: {
    type: string;
    data: Buffer;
  };
  spaceType: SpaceTypeEnum | any;
  metadata?: SpaceMetadataInterface;
}

/** Get Space **/

export interface OldSpaceRequest {
  spaceId: string;
}

export interface SpaceResponse {
  space: OldSpaceInterface;
  admin: boolean;
  member?: boolean;
  owner?: boolean;
  status: number;
  message: string;
  spaceType: SpaceTypeEnum;
  children: OldSpaceInterface[];
  ancestors?: OldSpaceInterface[];
  ownerName?: string;
}

/** Edit Space **/

export interface SpaceSettingsInterface {
  parentId: string;
  root: boolean;
  name: string;
  description: string;
  secret: number;
}

export interface EditSpaceRequest {
  spaceId: string;
  settings: SpaceSettingsInterface;
}

export interface EditSpaceResponse extends SpaceSettingsInterface {}

/** Delete space **/

export interface OldDeleteSpaceRequest {
  spaceId: string;
}

export interface OldDeleteSpaceResponse {
  status: number;
  message: string;
}

/** User Space List **/

export interface UserSpaceListRequest {
  userId: string;
}

export interface UserSpaceListItemResponse {
  id: string;
  name: string;
  ownedById: string;
  name_hash: string;
  created_at: string;
  updated_at: string;
  uiTypeId: string;
  parentId: string;
  minimap: number;
  visible: number;
  isAdmin: number;
  spaceTypeName: string;
}

/** Remove user from space **/

export interface RemoveUserRequest {
  user: Omit<UserEditInterface, 'isAdmin'>;
}

export interface RemoveUserResponse {
  status: number;
  message: string;
}

/** Edit user from space **/

export interface EditUserRequest {
  user: UserEditInterface;
}

export interface EditUserResponse {}

/** Add user to space **/

export interface AddUserRequest {
  user: UserEditInterface;
}

export interface AddUserResponse {}

/** Create space **/
export interface NewSpaceDetailsInterface {
  parentId?: string;
  name: string;
  spaceType?: SpaceTypeEnum;
  worldId?: string;
  currentWorldId?: string;
  root?: boolean;
  visibility?: boolean;
  description?: string;
}

export interface CreateSpaceRequest {
  space: NewSpaceDetailsInterface;
}

export interface CreateSpaceResponse {
  id: string;
  status: any;
  message: string;
}

/** User owned spaces **/

export interface UserOwnedSpacesRequest {
  worldId: string;
}

export interface UserOwnedSpacesResponse {
  canCreate: boolean;
}

/** Create initiative **/

export interface CreateInitiativeRequest {
  initiative: Omit<NewSpaceDetailsInterface, 'worldId'>;
}

export interface CreateInitiativeResponse {
  id: string;
}

/** Serach **/

export interface OldSearchSpacesRequest {
  q: string;
  worldId: string;
}

export interface OldSearchSpacesResponse {
  results: OldSpaceInterface[];
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

/** World Config **/

export interface WorldConfigRequest {
  worldId: string;
}

export type WorldConfigType = {
  [field in MetadataFieldType]: string;
};

export interface WorldConfigResponse extends WorldConfigType {}
