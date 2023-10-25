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

export interface HostingAllowListItemInterface {
  user_id: string;
  name: string;
  avatar_hash: string;
  wallets: string[];
}

export interface GetHostingAllowListRequest {}

export interface GetHostingAllowListResponse extends Array<HostingAllowListItemInterface> {}

export interface ActivatePluginRequest {
  plugin_hash: string;
}
