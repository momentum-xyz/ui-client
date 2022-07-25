export interface AgoraTokenRequest {
  isStageMode: boolean;
  isScreenShare?: boolean;
  spaceId: string;
}

export interface AgoraTokenResponse extends String {}
