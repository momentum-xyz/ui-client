import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {timelineRepositoryEndpoints} from './timelineRepository.api.endpoints';
import {
  FetchTimelineRequest,
  FetchTimelineResponse,
  CreateTimelineRequest,
  CreateTimelineResponse,
  UpdateTimelineRequest,
  UpdateTimelineResponse,
  DeleteTimelineRequest,
  DeleteTimelineResponse
} from './timelineRepository.api.types';

export const fetchTimeline: RequestInterface<FetchTimelineRequest, FetchTimelineResponse> = (
  options
) => {
  const {objectId, startIndex, pageSize, ...rest} = options;

  const requestParams = {
    params: {startIndex, pageSize},
    ...rest
  };

  const url = generatePath(timelineRepositoryEndpoints().base, {objectId});
  return request.get(url, requestParams);
};

export const createItem: RequestInterface<CreateTimelineRequest, CreateTimelineResponse> = (
  options
) => {
  const {objectId, type, hash, description, ...restOptions} = options;
  const url = generatePath(timelineRepositoryEndpoints().base, {objectId});
  return request.post(url, {type, hash, description}, restOptions);
};

export const updateItem: RequestInterface<UpdateTimelineRequest, UpdateTimelineResponse> = (
  options
) => {
  const {id, objectId, type, hash, description, ...restOptions} = options;
  const url = generatePath(timelineRepositoryEndpoints().item, {objectId, id});
  return request.patch(url, {type, hash, description}, restOptions);
};

export const deleteItem: RequestInterface<DeleteTimelineRequest, DeleteTimelineResponse> = (
  options
) => {
  const {id, objectId, ...restOptions} = options;
  const url = generatePath(timelineRepositoryEndpoints().item, {objectId, id});
  return request.delete(url, restOptions);
};
