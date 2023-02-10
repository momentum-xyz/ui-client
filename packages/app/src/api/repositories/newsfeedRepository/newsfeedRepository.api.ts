import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CreateNewsFeedRequest,
  CreateNewsFeedResponse,
  NewsFeedRequest,
  NewsFeedResponse,
  NotificationRequest,
  NotificationResponse
} from './newsfeedRepository.api.types';
import {newsfeedRepositoryEndpoints} from './newsfeedRepository.api.endpoints';

// FIXME: Data should have only ids on NFT.
// Don't need to store fields like name, image. These data should come from NFT
export const fetch: RequestInterface<NewsFeedRequest, NewsFeedResponse> = (options) => {
  const {...restOptions} = options;
  return request.get(newsfeedRepositoryEndpoints().newsfeed, restOptions);
};

export const create: RequestInterface<CreateNewsFeedRequest, CreateNewsFeedResponse> = (
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
