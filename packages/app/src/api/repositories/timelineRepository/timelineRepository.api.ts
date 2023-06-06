import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {timelineRepositoryEndpoints} from './timelineRepository.api.endpoints';
import {
  FetchTimelineRequest,
  FetchTimelineResponse,
  CreateTimelineRequest,
  CreateTimelineResponse
} from './timelineRepository.api.types';

export const fetchTimeline: RequestInterface<FetchTimelineRequest, FetchTimelineResponse> = (
  options
) => {
  const {objectId, ...restOptions} = options;
  const url = generatePath(timelineRepositoryEndpoints().base, {objectId});
  return request.get(url, restOptions);
};

export const createTimeline: RequestInterface<CreateTimelineRequest, CreateTimelineResponse> = (
  options
) => {
  const {objectId, type, data, ...restOptions} = options;
  const url = generatePath(timelineRepositoryEndpoints().base, {objectId});
  return request.post(url, {type, data}, restOptions);
};
