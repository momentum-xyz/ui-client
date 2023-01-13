export interface StreamChatRequest {
  spaceId: string;
}

export interface StreamChatTokenResponse {
  channel: string;
  token: string;
  channel_type: string;
}
