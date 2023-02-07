import {CheckJobStatusEnum} from '@momentum-xyz/core';

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

export interface UpdateUserResponse {
  job_id: string | null;
  user_id: string;
}

/** CHECK JOB OF UPDATING PROFILE **/

export interface CheckProfileUpdatingJobRequest {
  job_id: string;
}

export interface CheckProfileUpdatingJobResponse {
  status: CheckJobStatusEnum;
  user_id: string;
}
