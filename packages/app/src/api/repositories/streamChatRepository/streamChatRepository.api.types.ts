export interface StreamChatRequest {
  objectId: string;
}

export interface StreamChatTokenResponse {
  channel: string;
  token: string;
  channel_type: string;
}
