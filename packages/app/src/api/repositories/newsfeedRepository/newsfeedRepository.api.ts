import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CreateNewsfeedRequest,
  CreateNewsfeedResponse,
  NewsfeedRequest,
  NewsfeedResponse,
  NotificationRequest,
  NotificationResponse
} from './newsfeedRepository.api.types';
import {newsfeedRepositoryEndpoints} from './newsfeedRepository.api.endpoints';

export const fetch: RequestInterface<NewsfeedRequest, NewsfeedResponse> = (options) => {
  const {...restOptions} = options;
  return request.get(newsfeedRepositoryEndpoints().newsfeed, restOptions);
};

export const create: RequestInterface<CreateNewsfeedRequest, CreateNewsfeedResponse> = (
  options
) => {
  const {item, ...rest} = options;
  return request.post(newsfeedRepositoryEndpoints().newsfeed, {items: [item]}, rest);
};

// TODO: It isn't used.
// We should design notification for particular world
export const fetchByWorld: RequestInterface<NotificationRequest, NotificationResponse> = (
  options
) => {
  const {...restOptions} = options;
  return request.get(newsfeedRepositoryEndpoints().notifications, restOptions);
};
