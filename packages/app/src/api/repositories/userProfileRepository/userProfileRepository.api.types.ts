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
