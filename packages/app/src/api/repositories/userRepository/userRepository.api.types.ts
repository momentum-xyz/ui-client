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
}

/** CHECK USER **/

export interface CheckUserRequest {
  idToken?: string;
}

export interface CheckUserResponse extends UserInterface {}

/** FETCH ME **/

export interface FetchMeRequest {}

export interface FetchMeResponse extends UserInterface {}

/** FETCH User **/

export interface FetchUserRequest {
  userId: string;
}

export interface FetchUserResponse extends UserInterface {}
