import {UserInterface} from 'api';

export interface WorldInfoInterface {
  id: string;
  name: string;
  description?: string;
  avatarHash: string | null;
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
