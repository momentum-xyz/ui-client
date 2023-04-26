import {UserInterface} from 'api';

export interface WorldInfoInterface {
  id: string;
  name: string;
  description?: string;
  avatarHash: string | null;
  owner_id: string;
  owner_name?: string | null;
  stake_total?: number;
}

export interface WorldInterface {
  id: string;
  name: string;
  description?: string;
  avatarHash: string | null;
  createdAt?: string;
  last_staking_comment: string | null;
  owner_id: string;
  owner_name?: string | null;
  stake_total?: number | null;
  stakers: WorldStakerInterface[] | null;
}

export interface WorldStakerInterface {
  user_id: string;
  name: string;
  stake?: number | null;
  avatarHash?: string | null;
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

/** Online Users **/

export interface GetOnlineUsersRequest {
  worldId: string;
}

export interface OdysseyOnlineUsersResponse extends Array<UserInterface> {}
