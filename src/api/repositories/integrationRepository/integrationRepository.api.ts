import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {integrationRepositoryEndpoints} from './integrationRepository.api.endpoints';
import {
  FetchIntegrationRequest,
  FetchIntegrationResponse,
  EnableIntegrationRequest,
  EnableIntegrationResponse,
  DisableIntegrationRequest,
  DisableIntegrationResponse
} from './integrationRepository.api.types';

export const fetchIntegration: RequestInterface<
  FetchIntegrationRequest,
  FetchIntegrationResponse
> = (options) => {
  const {spaceId, integrationType, ...rest} = options;

  const fetchUrl = integrationRepositoryEndpoints().fetch;
  const URL: string = generatePath(fetchUrl, {spaceId, integrationType});
  return request.get(URL, rest);
};

export const enableIntegration: RequestInterface<
  EnableIntegrationRequest,
  EnableIntegrationResponse
> = (options) => {
  const {spaceId, integrationType, data, ...rest} = options;

  const URL: string = integrationRepositoryEndpoints().enable;
  return request.post(URL, {spaceId, integrationType, data}, rest);
};

export const disableIntegration: RequestInterface<
  DisableIntegrationRequest,
  DisableIntegrationResponse
> = (options) => {
  const {spaceId, integrationType, data, ...rest} = options;

  alert(1);

  const URL: string = integrationRepositoryEndpoints().disable;
  return request.post(URL, {spaceId, integrationType, data}, rest);
};
