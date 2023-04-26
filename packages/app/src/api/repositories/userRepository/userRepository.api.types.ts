import {UserStatusEnum} from '@momentum-xyz/ui-kit';

import {UserProfileInterface, WorldInfoInterface} from 'api';

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
  profile: UserProfileInterface;
}

export interface StakeInfoInterface {
  wallet_id: string;
  amount: string;
  blockchain_id: string;
  lastComment: string | null;
  name: string;
  object_id: string;
  reward: string | null;
  updatedAt: string;
}

/** FETCH ME **/

export interface FetchMeRequest {}

export interface FetchMeResponse extends UserInterface {}

/** FETCH MY WALLETS **/

export interface FetchMyWalletsRequest {}

export interface FetchMyWalletsResponse {}

/** FETCH MY STAKES **/

export interface FetchMyStakesRequest {}

export interface FetchMyStakesResponse extends Array<StakeInfoInterface> {}

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

/** FETCH OWNED WORLD LIST **/

export interface FetchUserWorldListRequest {
  userId: string;
}

export interface FetchUserWorldListResponse extends Array<WorldInfoInterface> {}

/** FETCH STAKED WORLD LIST **/

export interface FetchUserStakedWorldListRequest {
  userId: string;
}

export interface FetchUserStakedWorldListResponse extends Array<WorldInfoInterface> {}
