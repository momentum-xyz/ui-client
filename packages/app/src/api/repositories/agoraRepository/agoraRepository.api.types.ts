export interface AgoraTokenRequest {
  objectId: string;
  screenshare?: boolean;
}

export interface AgoraTokenResponse {
  token: string;
  channel: string;
}
