import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  DashboardRequestInterface,
  DashboardResponseInterface
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
