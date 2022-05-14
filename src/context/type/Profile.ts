export interface Profile {
  bio?: string;
  location?: string;
  avatarHash?: string;
  profileLink?: string;
}

export interface ProfileEditDTO {
  profile: Profile;
}

export interface ProfileEditResponse {
  status: number;
  message: string;
}
