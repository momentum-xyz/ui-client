import {UserStatusEnum} from '@momentum-xyz/ui-kit';

import {UserProfileInterface} from 'api';

/** COMMON **/

export interface UserInterface {
  id: string;
  name: string;
  description: string | null;
  userTypeId: string;
  createdAt: string;
  updatedAt: string | null;
  wallet: string | null;
  isNodeAdmin: boolean;
  status: UserStatusEnum | null;
  profile: UserProfileInterface;
  isGuest?: boolean;
}

export interface UserInfoInterface {
  id: string;
  name: string;
  description?: string;
  profile: UserProfileInterface;
}

/** FETCH ME **/

export interface FetchMeRequest {}

export interface FetchMeResponse extends UserInterface {}

/** FETCH User **/

export interface FetchUserRequest {
  userId: string;
}

export interface FetchUserResponse extends UserInterface {}

/** FETCH USER LIST **/

export interface FetchUserListRequest {
  sortDirection: 'DESC' | 'ASC';
  limit: number;
}

export interface FetchUserListResponse extends Array<UserInfoInterface> {}
