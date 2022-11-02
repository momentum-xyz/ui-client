/** COMMON **/

import {UserStatusEnum} from '@momentum-xyz/ui-kit';

import {UserInterface, UserProfileInterface, UserSpaceInterface} from 'api';

export interface OnlineUserInterface {
  id: string;
  name: string;
  profile: UserProfileInterface;
  status?: UserStatusEnum;
}

/** Invite user to space **/

export interface InvitedUserInterface {
  email: string;
  isAdmin: boolean;
  spaceId: string;
}

export interface InviteToSpaceRequest {
  invitedUser: InvitedUserInterface;
}

export interface InviteToSpaceResponse {}

/** Search users **/

export interface UserSearchRequest {
  q: string;
  online?: boolean;
  worldId?: string;
}

export interface UserSearchResponse {
  results: UserInterface[];
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

/** Profile **/

export interface ProfileRequest {
  userId: string;
}

export interface ProfileResponse extends UserInterface {}

/* Online users */

export interface OnlineUsersRequest {
  worldId: string;
}

export interface OnlineUsersResponse extends Array<UserInterface> {}

export interface FetchUserInitiativesRequest {
  userId: string;
}

export interface FetchUserInitiativesResponse extends Array<UserSpaceInterface> {}

export interface UpdateProfileInterface {
  name: string;
  profile: UserProfileInterface;
}
