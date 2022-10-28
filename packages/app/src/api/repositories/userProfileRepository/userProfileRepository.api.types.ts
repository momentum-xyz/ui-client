import {UserInterface} from 'api';

/** COMMON **/

export interface UserProfileInterface {
  onBoarded?: boolean;
  bio?: string;
  location?: string;
  avatarHash?: string;
  profileLink?: string;
  // TODO: Remove this field
  image?: File;
}

/** UPDATE USER PROFILE **/

export interface UpdateUserRequest {
  name: string;
  profile: UserProfileInterface;
}

export interface UpdateUserResponse extends UserInterface {}
