import {PostTypeEnum} from '@momentum-xyz/core';

/** COMMON **/

export interface NewsfeedItemInterface {
  activity_id: string;
  created_at: string;
  object_id: string;
  world_name: string;
  user_id: string;
  user_name: string;
  avatar_hash: string | null;
  type: PostTypeEnum;
  data: {
    hash: string;
    description: string;
    position: {x: number; y: number; z: number};
  };
}

/** FETCH NEWSFEED **/

export interface FetchNewsfeedRequest {
  startIndex: number;
  pageSize: number;
}

export interface FetchNewsfeedResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  activities: NewsfeedItemInterface[];
}
