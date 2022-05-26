export interface SpaceInviteDto {
  spaceId: string;
  userId: string;
  isTable?: boolean;
}

export interface SpaceInviteResponse {
  status: number;
  message: string;
}
