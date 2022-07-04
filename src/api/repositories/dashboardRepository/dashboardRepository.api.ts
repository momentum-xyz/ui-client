import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  DashboardRequestInterface,
  DashboardResponseInterface,
  TilesUpdatePositionInterface
} from './dashboardRepository.api.types';
import {dashboardRepositoryApiEndpoints} from './dashboardRepository.api.endpoints';

export const fetchDashboard: RequestInterface<
  DashboardRequestInterface,
  DashboardResponseInterface
> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = `${dashboardRepositoryApiEndpoints().base}/${spaceId}`;

  return request.get(url, restOptions);
};

export const updateDashboardPositions: RequestInterface<
  TilesUpdatePositionInterface,
  DashboardResponseInterface
> = (options) => {
  const {data, ...restOptions} = options;
  const url = `${dashboardRepositoryApiEndpoints().updatePositions}`;
  return request.post(url, data, restOptions);
};
