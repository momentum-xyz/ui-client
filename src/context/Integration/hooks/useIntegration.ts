import {useFetch, usePost} from '../../../hooks/api/useApi';
import {IntegrationDTO} from '../IntegrationTypes';
import {appVariables} from '../../../api/constants';
import {IntegrationTypeEnum} from '../../../core/enums';

export const useIntegrationFetch = (spaceId: string, integrationType: IntegrationTypeEnum) => {
  const response = useFetch<IntegrationDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/space-integrations/${spaceId}/${integrationType}`,
    {
      fetchPolicy: 'cache-and-network'
    }
  );
  return response;
};

export const useIntegrationEnable = () => {
  return usePost<IntegrationDTO, IntegrationDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/space-integrations/enable`
  );
};

export const useIntegrationDisable = () => {
  return usePost<IntegrationDTO, IntegrationDTO>(
    appVariables.BACKEND_ENDPOINT_URL + `/space-integrations/disable`
  );
};
