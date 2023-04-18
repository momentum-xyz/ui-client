import {RequestInterface} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {request} from 'api/request';

import {worldRepositoryEndpoints} from './worldRepository.api.endpoints';
import {
  FetchWorldListRequest,
  FetchWorldListResponse,
  GetOnlineUsersRequest,
  OdysseyOnlineUsersResponse
} from './worldRepository.api.types';

export const fetchWorldList: RequestInterface<FetchWorldListRequest, FetchWorldListResponse> = (
  options
) => {
  const {limit, sortDirection, ...restOptions} = options;
  restOptions.params = {sort: sortDirection, limit};
  return request.get(worldRepositoryEndpoints().list, restOptions);
};

export const fetchOnlineUsers: RequestInterface<
  GetOnlineUsersRequest,
  OdysseyOnlineUsersResponse
> = (options) => {
  const {worldId, ...restOptions} = options;

  const url = generatePath(worldRepositoryEndpoints().onlineUsers, {worldId});
  return request.get(url, restOptions);
};
