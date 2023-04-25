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

/** FETCH WORLD LIST **/

export interface FetchWorldListRequest {
  sortDirection: 'DESC' | 'ASC';
  limit: number;
}

export interface FetchWorldListResponse extends Array<WorldInfoInterface> {}

/** Online Users **/

export interface GetOnlineUsersRequest {
  worldId: string;
}

export interface OdysseyOnlineUsersResponse extends Array<UserInterface> {}
