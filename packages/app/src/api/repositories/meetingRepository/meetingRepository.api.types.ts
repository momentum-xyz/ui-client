/** KICK USER **/

export interface KickUserRequest {
  spaceId: string;
  userId: string;
}

export interface KickUserResponse {}

/** MUTE USER **/

export interface MuteUserRequest {
  spaceId: string;
  userId: string;
}

export interface MuteUserResponse {}

/** MUTE ALL USERS **/

export interface MuteAllUserRequest {
  spaceId: string;
}

export interface MuteAllUserResponse {}
