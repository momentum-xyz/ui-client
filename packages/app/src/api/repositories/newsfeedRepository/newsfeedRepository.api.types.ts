import {TimelineItemInterface} from 'api';

/** FETCH TIMELINE **/

export interface FetchNewsfeedRequest {
  startIndex: number;
  pageSize: number;
}

export interface FetchNewsfeedResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  activities: TimelineItemInterface[];
}
