import {SpaceType} from 'core/enums';

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
  space?: SpaceInterface;
}

export interface SpaceMetadata {
  kusama_metadata?: {
    operator_id?: string;
  };
}

export interface SpaceInterface {
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
  children?: SpaceInterface[];
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
  spaceType: SpaceType | any;
  metadata?: SpaceMetadata;
}

/** Get Space **/

export interface SpaceRequest {
  spaceId: string;
}

export interface SpaceResponse {
  space: SpaceInterface;
  admin: boolean;
  member?: boolean;
  status: number;
  message: string;
  spaceType: SpaceType;
  children: SpaceInterface[];
  ancestors?: SpaceInterface[];
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

export interface DeleteSpaceRequest {
  spaceId: string;
}

export interface DeleteSpaceResponse {
  status: number;
  message: string;
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
export interface NewSpaceDetails {
  parentId?: string;
  name: string;
  spaceType?: SpaceType;
  worldId?: string;
  currentWorldId?: string;
  root?: boolean;
  visibility?: boolean;
  description?: string;
}

export interface CreateSpaceRequest {
  newSpace: NewSpaceDetails;
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
  initiative: Omit<NewSpaceDetails, 'worldId'>;
}

export interface CreateInitiativeResponse {
  id: string;
}

/** Serach **/

export interface SearchSpacesRequest {
  q: string;
  worldId: string;
}

export interface SearchSpacesResponse {
  results: SpaceInterface[];
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
