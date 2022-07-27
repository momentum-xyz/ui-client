import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {
  CreateTileRequest,
  CreateTileResponse,
  DashboardRequestInterface,
  DashboardResponseInterface,
  DeleteTileRequest,
  DeleteTileResponse,
  ImageUploadRequest,
  ImageUploadResponse,
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

export const uploadTileImage: RequestInterface<ImageUploadRequest, ImageUploadResponse> = (
  options
) => {
  const {file, ...restOptions} = options;
  const formData: FormData = new FormData();
  formData.append('file', file);
  const requestParams = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...restOptions
  };
  const url = `${dashboardRepositoryApiEndpoints().upload}`;
  return request.post(url, formData, requestParams);
};

export const createTile: RequestInterface<CreateTileRequest, CreateTileResponse> = (options) => {
  const {data, spaceId, ...restOptions} = options;
  const url = `${dashboardRepositoryApiEndpoints().create}/${spaceId}`;
  return request.post(url, data, restOptions);
};

export const deleteTile: RequestInterface<DeleteTileRequest, DeleteTileResponse> = (options) => {
  const {tileId, ...restOptions} = options;
  const url = `${dashboardRepositoryApiEndpoints().delete}/${tileId}`;
  return request.post(url, restOptions);
};
