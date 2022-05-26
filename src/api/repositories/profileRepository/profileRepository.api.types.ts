import {UserProfileInterface} from 'api';

/** UPDATE USER **/

export interface UpdateUserRequest {
  name: string;
  profile: UserProfileInterface;
}

export interface UpdateUserResponse {
  userOnboarded?: boolean;
}
