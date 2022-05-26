import {useFetch, usePost} from '../../../hooks/api/useApi';
import {IntegrationDTO, IntegrationTypes} from '../IntegrationTypes';
import {appVariables} from '../../../api/constants';

export const useIntegrationFetch = (spaceId: string, integrationType: IntegrationTypes) => {
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

export const useModerator = (id: string) => {
  return useFetch(appVariables.BACKEND_ENDPOINT_URL + `/space-integrations/${id}/check`, {
    fetchPolicy: 'network-only'
  });
};
