export interface WorldInfoInterface {
  id: string;
  name: string;
  description?: string | null;
  avatarHash: string | null;
  website_link?: string | null;
  owner_id: string;
  owner_name?: string | null;
  stake_total?: string;
}

export interface WorldInterface {
  id: string;
  name: string;
  description?: string | null;
  website_link?: string | null;
  avatarHash: string | null;
  createdAt?: string;
  last_staking_comment: string | null;
  owner_id: string;
  owner_name?: string | null;
  stake_total?: string | null;
  stakers: WorldStakerInterface[] | null;
  is_admin?: boolean;
}

export interface WorldStakerInterface {
  user_id: string;
  name: string;
  stake: string;
  avatarHash: string | null;
}

/** FETCH WORLD LIST **/

export interface FetchWorldListRequest {
  sortDirection: 'DESC' | 'ASC';
  limit: number;
}

export interface FetchWorldListResponse extends Array<WorldInfoInterface> {}

/** FETCH WORLD **/

export interface FetchWorldRequest {
  worldId: string;
}

export interface FetchWorldResponse extends WorldInterface {}

/** PATCH WORLD **/

export interface PatchWorldRequest {
  worldId: string;
  name: string;
  description: string;
  website_link: string;
  avatarHash?: string;
}

export interface PatchWorldResponse {}
