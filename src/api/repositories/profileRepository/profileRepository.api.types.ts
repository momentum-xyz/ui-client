import {UserProfileInterface} from 'api';

/** UPDATE USER **/

export interface UpdateUserRequest {
  name: string;
  profile: UserProfileInterface;
}

export interface UpdateUserResponse {
  userOnboarded?: boolean;
}

/** UPLOAD AVATAR **/

export interface UploadAvatarRequest {
  avatar: File;
}

export interface UploadAvatarResponse {
  hash: string;
}
