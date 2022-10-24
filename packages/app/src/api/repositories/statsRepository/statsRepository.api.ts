import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {WorldStatsRequest, WorldStatsResponse} from './statsRepository.api.types';
import {statsRepositoryEndpoints} from './statsRepository.api.endpoints';

export const fetchWorldStats: RequestInterface<WorldStatsRequest, WorldStatsResponse[]> = (
  options
) => {
  const {spaceId, ...rest} = options;
  const URL = `${statsRepositoryEndpoints().stats}/${spaceId}`;
  return request.get(URL, rest);
};
