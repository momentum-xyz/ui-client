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
  const {objectId, page, pageSize, ...rest} = options;

  const requestParams = {
    params: {page, pageSize},
    ...rest
  };

  const url = generatePath(timelineRepositoryEndpoints().base, {objectId});
  return request.get(url, requestParams);
};

export const createTimeline: RequestInterface<CreateTimelineRequest, CreateTimelineResponse> = (
  options
) => {
  const {objectId, type, hash, description, ...restOptions} = options;
  const url = generatePath(timelineRepositoryEndpoints().base, {objectId});
  return request.post(url, {type, hash, description}, restOptions);
};
