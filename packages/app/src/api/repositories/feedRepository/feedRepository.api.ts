import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  CreateNewsFeedRequest,
  CreateNewsFeedResponse,
  NewsFeedRequest,
  NewsFeedResponse,
  NotificationRequest,
  NotificationResponse
} from './feedRepository.api.types';
import {feedRepositoryEndpoints} from './feedRepository.api.endpoints';

// FIXME: Data should have only ids on NFT.
// Don't need to store fields like name, image. These data should come from NFT
export const fetchFeed: RequestInterface<NewsFeedRequest, NewsFeedResponse> = (options) => {
  const {...restOptions} = options;
  return request.get(feedRepositoryEndpoints().feed, restOptions);
};

// FIXME: Data should have only ids on NFT.
// Don't need to store fields like name, image. These data should come from NFT
export const fetchNotifications: RequestInterface<NotificationRequest, NotificationResponse> = (
  options
) => {
  const {...restOptions} = options;
  return request.get(feedRepositoryEndpoints().notifications, restOptions);
};

export const createFeedItem: RequestInterface<CreateNewsFeedRequest, CreateNewsFeedResponse> = (
  options
) => {
  const {item, ...rest} = options;

  return request.post(feedRepositoryEndpoints().feed, {items: [item]}, rest);
};
