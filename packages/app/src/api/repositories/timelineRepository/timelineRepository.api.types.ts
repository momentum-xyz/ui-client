import {PostTypeEnum} from '@momentum-xyz/core';

/** COMMON **/

export interface TimelineItemInterface {
  activity_id: string;
  created_at: string;
  object_id: string;
  user_id: string;
  type: PostTypeEnum;
  data: {
    hash: string;
    description: string;
    position: {x: number; y: number; z: number};
  };
}

/** FETCH TIMELINE **/

export interface FetchTimelineRequest {
  objectId: string;
  page: number;
  pageSize: number;
}

export interface FetchTimelineResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  activities: TimelineItemInterface[];
}

/** CREATE TIMELINE ITEM **/

export interface CreateTimelineRequest {
  objectId: string;
  type: PostTypeEnum;
  hash: string;
  description: string | null;
}

export interface CreateTimelineResponse {}

/** UPDATE TIMELINE ITEM **/

export interface UpdateTimelineRequest {
  id: string;
  objectId: string;
  type: PostTypeEnum;
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
