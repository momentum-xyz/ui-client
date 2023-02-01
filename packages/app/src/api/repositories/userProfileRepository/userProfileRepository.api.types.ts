import {UserInterface} from 'api';

/** COMMON **/

export interface UserProfileInterface {
  bio?: string;
  location?: string;
  avatarHash?: string;
  profileLink?: string;
}

/** UPDATE USER PROFILE **/

export interface UpdateUserRequest {
  name: string;
  profile: UserProfileInterface;
}

export interface UpdateUserResponse extends UserInterface {}
