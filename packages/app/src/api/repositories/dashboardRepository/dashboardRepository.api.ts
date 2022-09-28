import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  CreateTileRequest,
  CreateTileResponse,
  DashboardRequestInterface,
  DashboardResponseInterface,
  DeleteTileRequest,
  DeleteTileResponse,
  TilesUpdatePositionInterface,
  UpdateTileRequest,
  UpdateTileResponse
} from './dashboardRepository.api.types';
import {dashboardRepositoryApiEndpoints} from './dashboardRepository.api.endpoints';

export const fetchDashboard: RequestInterface<
  DashboardRequestInterface,
  DashboardResponseInterface
> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = generatePath(dashboardRepositoryApiEndpoints().fetchDashboard, {spaceId});

  return request.get(url, restOptions);
};

export const updateDashboardPositions: RequestInterface<
  TilesUpdatePositionInterface,
  DashboardResponseInterface
> = (options) => {
  const {data, ...restOptions} = options;
  const url = dashboardRepositoryApiEndpoints().updatePositions;
  return request.post(url, data, restOptions);
};

export const createTile: RequestInterface<CreateTileRequest, CreateTileResponse> = (options) => {
  const {data, spaceId, ...restOptions} = options;
  const url = generatePath(dashboardRepositoryApiEndpoints().create, {spaceId});
  return request.post(url, data, restOptions);
};

export const updateTile: RequestInterface<UpdateTileRequest, UpdateTileResponse> = (options) => {
  const {data, tileId, ...restOptions} = options;
  const url = generatePath(dashboardRepositoryApiEndpoints().update, {tileId});
  return request.post(url, data, restOptions);
};

export const deleteTile: RequestInterface<DeleteTileRequest, DeleteTileResponse> = (options) => {
  const {tileId, ...restOptions} = options;
  const url = generatePath(dashboardRepositoryApiEndpoints().delete, {tileId});
  return request.post(url, restOptions);
};
