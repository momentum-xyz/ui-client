import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';

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
> = (request, options) => {
  const {spaceId, ...rest} = options;

  const fetchUrl = integrationRepositoryEndpoints().fetch;
  const URL: string = generatePath(fetchUrl, {spaceId, integrationType: 'miro'});
  return request.get(URL, rest);
};

export const enableMiroIntegration: RequestInterface<
  EnableMiroIntegrationRequest,
  EnableMiroIntegrationResponse
> = (request, options) => {
  const {spaceId, data, ...rest} = options;

  const URL: string = integrationRepositoryEndpoints().enable;
  return request.post(URL, {spaceId, integrationType: 'miro', data}, rest);
};

export const disableMiroIntegration: RequestInterface<
  DisableMiroIntegrationRequest,
  DisableMiroIntegrationResponse
> = (request, options) => {
  const {spaceId, ...rest} = options;

  const data = {
    spaceId,
    integrationType: 'miro',
    data: {id: '', name: '', description: '', viewLink: '', accessLink: '', embedHtml: ''}
  };

  const URL: string = integrationRepositoryEndpoints().disable;
  return request.post(URL, data, rest);
};
