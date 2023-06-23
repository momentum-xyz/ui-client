import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {newsfeedRepositoryEndpoints} from './newsfeedRepository.api.endpoints';
import {FetchNewsfeedRequest, FetchNewsfeedResponse} from './newsfeedRepository.api.types';

export const fetchNewsfeed: RequestInterface<FetchNewsfeedRequest, FetchNewsfeedResponse> = (
  options
) => {
  const {startIndex, pageSize, ...rest} = options;

  const requestParams = {
    params: {startIndex, pageSize},
    ...rest
  };

  return request.get(newsfeedRepositoryEndpoints().base, requestParams);
};
