import {generatePath} from 'react-router-dom';

import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';
import {IntegrationTypeEnum} from 'core/enums';

import {spaceIntegrationsEndpoints} from './spaceIntegrations.api.endpoints';
import {
  SpaceIntegrationEnableRequest,
  SpaceIntegrationsStageModeRequest,
  SpaceIntegrationsStageModeResponse
} from './spaceIntegrations.api.types';

export const fetchStageModeStatus: RequestInterface<
  SpaceIntegrationsStageModeRequest,
  SpaceIntegrationsStageModeResponse
> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = generatePath(spaceIntegrationsEndpoints().stageMode, {spaceId});

  return request.get(url, restOptions);
};

export const enableStageMode: RequestInterface<SpaceIntegrationEnableRequest, void> = (options) => {
  const {spaceId, ...restOptions} = options;
  const url = spaceIntegrationsEndpoints().enable;

  return request.post(
    url,
    {
      spaceId,
      integrationType: IntegrationTypeEnum.STAGE_MODE
    },
    restOptions
  );
};

export const disableStageMode: RequestInterface<SpaceIntegrationEnableRequest, void> = (
  options
) => {
  const {spaceId, ...restOptions} = options;
  const url = spaceIntegrationsEndpoints().disable;

  return request.post(
    url,
    {
      spaceId,
      integrationType: IntegrationTypeEnum.STAGE_MODE
    },
    restOptions
  );
};
