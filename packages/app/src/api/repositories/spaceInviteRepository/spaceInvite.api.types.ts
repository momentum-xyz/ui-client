/** Space Invite **/

export interface SpaceInviteRequest {
  spaceId: string;
  userId: string;
  isTable?: boolean;
}

export interface SpaceInviteResponse {
  id: string;
}
