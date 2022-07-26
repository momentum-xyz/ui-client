import {generatePath} from 'react-router-dom';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';
import {IntegrationTypeEnum} from 'core/enums';

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
> = (options) => {
  const {spaceId, integrationType, ...rest} = options;

  const fetchUrl = integrationRepositoryEndpoints().fetch;
  const URL: string = generatePath(fetchUrl, {spaceId, integrationType});
  return request.get(URL, rest);
};

export const enableMiroIntegration: RequestInterface<
  EnableMiroIntegrationRequest,
  EnableMiroIntegrationResponse
> = (options) => {
  const {spaceId, data, ...rest} = options;

  const URL: string = integrationRepositoryEndpoints().enable;
  return request.post(URL, {spaceId, integrationType: IntegrationTypeEnum.MIRO, data}, rest);
};

export const disableMiroIntegration: RequestInterface<
  DisableMiroIntegrationRequest,
  DisableMiroIntegrationResponse
> = (options) => {
  const {spaceId, ...rest} = options;

  const data = {
    spaceId,
    integrationType: IntegrationTypeEnum.MIRO,
    data: {id: '', name: '', description: '', viewLink: '', accessLink: '', embedHtml: ''}
  };

  const URL: string = integrationRepositoryEndpoints().disable;
  return request.post(URL, data, rest);
};
