export interface GetNodeChallengeRequest {
  odyssey_id: string;
}

export interface GetNodeChallengeResponse {
  challenge: string;
}

export interface AddToHostingAllowListRequest {
  wallet?: string;
  user_id?: string;
}

export interface RemoveFromHostingAllowListRequest {
  user_id: string;
}
