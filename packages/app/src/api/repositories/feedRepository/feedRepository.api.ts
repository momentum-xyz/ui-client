import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {
  NewsFeedRequest,
  NewsFeedResponse,
  NotificationRequest,
  NotificationResponse
} from './feedRepository.api.types';
import {feedRepositoryEndpoints} from './feedRepository.api.endpoints';

export const fetchFeed: RequestInterface<NewsFeedRequest, NewsFeedResponse> = (options) => {
  const {...restOptions} = options;
  return request.get(feedRepositoryEndpoints().feed, restOptions);
};

export const fetchNotifications: RequestInterface<NotificationRequest, NotificationResponse> = (
  options
) => {
  const {...restOptions} = options;
  return request.get(feedRepositoryEndpoints().notifications, restOptions);
};
