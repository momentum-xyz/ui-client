/** COMMON **/

import {UserSpaceInterface} from 'api/repositories/spaceRepository/spaceRepository.api.types';
import {UserStatusEnum} from 'core/enums';

export interface UserProfileInterface {
  bio?: string;
  location?: string;
  avatarHash?: string;
  profileLink?: string;
  onBoarded?: boolean;
}

export interface UserInterface {
  id: {
    type: string;
    data: Buffer;
  };
  userTypeId: {
    type: string;
    data: Buffer;
  };
  wallet: {
    type: string;
    data: Buffer;
  } | null;
  name: string;
  email?: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
  profile: UserProfileInterface;
  isNodeAdmin: boolean;
  status: UserStatusEnum;
}

export interface OnlineUserInterface {
  id: {
    type: string;
    data: Buffer;
  };
  name: string;
  profile: UserProfileInterface;
  status: UserStatusEnum;
}

/** CHECK USER **/

export interface CheckUserRequest {
  idToken?: string;
}

export interface CheckUserResponse {
  userOnboarded: boolean;
}

/** FETCH USER **/

export interface FetchUserRequest {}

export interface FetchUserResponse extends UserInterface {}

/** UPLOAD AVATAR **/

export interface UploadAvatarRequest {
  avatar: File;
}

export interface UploadAvatarResponse {
  hash: string;
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

export interface OnlineUsersResponse extends Array<OnlineUserInterface> {}

export interface FetchUserInitiativesRequest {
  userId: string;
}

export interface FetchUserInitiativesResponse extends Array<UserSpaceInterface> {}
