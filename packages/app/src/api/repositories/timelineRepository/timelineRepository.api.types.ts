import {TimelineTypeEnum} from '@momentum-xyz/core';

/** COMMON **/

export interface TimelineItemInterface {
  activity_id: string;
  created_at: string;
  object_id: string;
  world_name: string;
  world_avatar_hash: string | null;
  user_id: string;
  user_name: string;
  avatar_hash: string | null;
  type: TimelineTypeEnum;
  data: {
    hash: string;
    description: string;
    token_amount: string | null;
    token_symbol: string | null;
    position: {x: number; y: number; z: number};
  };
}

/** FETCH TIMELINE **/

export interface FetchTimelineRequest {
  objectId: string;
  startIndex: number;
  pageSize: number;
}

export interface FetchTimelineResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  activities: TimelineItemInterface[];
}

/** FETCH TIMELINE ITEM **/

export interface FetchTimelineItemRequest {
  objectId: string;
  id: string;
}

export interface FetchTimelineItemResponse extends TimelineItemInterface {}

/** CREATE TIMELINE ITEM **/

export interface CreateTimelineRequest {
  objectId: string;
  type: TimelineTypeEnum;
  hash: string;
  description: string | null;
}

export interface CreateTimelineResponse extends TimelineItemInterface {}

/** UPDATE TIMELINE ITEM **/

export interface UpdateTimelineRequest {
  id: string;
  objectId: string;
  type: TimelineTypeEnum;
  hash: string;
  description: string | null;
}

export interface UpdateTimelineResponse {}

/** DELETE TIMELINE ITEM **/

export interface DeleteTimelineRequest {
  id: string;
  objectId: string;
}

export interface DeleteTimelineResponse {}
