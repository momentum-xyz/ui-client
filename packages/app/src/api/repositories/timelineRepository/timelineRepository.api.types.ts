import {PostTypeEnum} from '@momentum-xyz/core';

/** COMMON **/

export interface TimelineItemInterface {
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

/*
* activity_id
:
"0188b8d8-85ac-7d2f-b015-77d05429cde9"

:
"bc1d47ca3b167b5a6c993114cd9f79f7"
created_at
:
"2023-06-14T07:39:37.774945Z"
data
:
{position: {x: 0, y: 0, z: 0}, description: "My screenshot #3",…}
object_id
:
"00000000-0000-8000-8000-000000000001"
type
:
"screenshot"
user_id
:
"0187c1e8-bb1c-7fe3-9bd8-8178672e25cc"
user_name
:
"kovi_mm"
world_name
:
"#Luigi. He is Mario
* */

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
