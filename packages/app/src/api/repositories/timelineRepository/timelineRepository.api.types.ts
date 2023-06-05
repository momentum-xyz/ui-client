import {PostTypeEnum} from '@momentum-xyz/core';

/** COMMON **/

export interface TimelineItemInterface {
  activity_id: string;
  user_id: string;
  object_id: string;
  created_at: string;
  type: PostTypeEnum;
  data: {
    render_hash: string;
    description: string | null;
  };
}

/** FETCH TIMELINE **/

export interface FetchTimelineRequest {
  objectId: string;
}

export interface FetchTimelineResponse extends Array<TimelineItemInterface> {}

/** CREATE TIMELINE **/

export interface CreateTimelineRequest {
  objectId: string;
  type: PostTypeEnum;
  data: {
    render_hash: string;
    description: string | null;
  };
}

export interface CreateTimelineResponse {}
