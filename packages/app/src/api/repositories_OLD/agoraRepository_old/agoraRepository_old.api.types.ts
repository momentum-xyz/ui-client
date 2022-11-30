export interface AgoraTokenRequest {
  isStageMode: boolean;
  spaceId: string;
}

export interface AgoraTokenResponse extends String {}

export interface RelayScreenShareRequest {
  spaceId: string;
}

export interface RelayScreenShareResponse {}
