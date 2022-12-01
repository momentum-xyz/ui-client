export interface AgoraTokenRequest {
  spaceId: string;
  screenshare?: boolean;
}

export interface AgoraTokenResponse {
  token: string;
  channel: string;
}
