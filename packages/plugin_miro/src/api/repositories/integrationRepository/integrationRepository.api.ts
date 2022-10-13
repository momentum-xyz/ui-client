import {generatePath} from 'react-router-dom';
import {RequestInterface} from '@momentum-xyz/core';

import {integrationRepositoryEndpoints} from './integrationRepository.api.endpoints';
import {
  FetchIntegrationRequest,
  FetchIntegrationResponse,
  EnableMiroIntegrationRequest,
  EnableMiroIntegrationResponse,
  DisableMiroIntegrationRequest,
  DisableMiroIntegrationResponse
} from './integrationRepository.api.types';

export const fetchIntegration: RequestInterface<
  FetchIntegrationRequest,
  FetchIntegrationResponse
> = (options, request) => {
  const {spaceId, ...rest} = options;

  const fetchUrl = integrationRepositoryEndpoints().fetch;
  const URL: string = generatePath(fetchUrl, {spaceId});
  return request.get(URL, rest);
};

export const enableMiroIntegration: RequestInterface<
  Omit<EnableMiroIntegrationRequest, 'integrationType'>,
  EnableMiroIntegrationResponse
> = (options, request) => {
  const {spaceId, data, ...rest} = options;

  const body: EnableMiroIntegrationRequest = {spaceId, integrationType: 'miro', data};

  const URL: string = integrationRepositoryEndpoints().enable;
  return request.post(URL, body, rest);
};

export const disableMiroIntegration: RequestInterface<
  Omit<DisableMiroIntegrationRequest, 'integrationType'>,
  DisableMiroIntegrationResponse
> = (options, request) => {
  const {spaceId, data, ...rest} = options;

  const body: DisableMiroIntegrationRequest = {
    spaceId,
    integrationType: 'miro',
    data
  };

  const URL: string = integrationRepositoryEndpoints().disable;
  return request.post(URL, body, rest);
};
