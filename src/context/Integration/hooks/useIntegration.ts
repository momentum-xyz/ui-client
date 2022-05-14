import {useFetch, usePost} from '../../../hooks/api/useApi';
import {IntegrationDTO, IntegrationTypes} from '../IntegrationTypes';

export const useIntegrationFetch = (spaceId: string, integrationType: IntegrationTypes) => {
  const response = useFetch<IntegrationDTO>(
    window._env_.BACKEND_ENDPOINT_URL + `/space-integrations/${spaceId}/${integrationType}`,
    {
      fetchPolicy: 'cache-and-network'
    }
  );
  return response;
};

export const useIntegrationEnable = () => {
  return usePost<IntegrationDTO, IntegrationDTO>(
    window._env_.BACKEND_ENDPOINT_URL + `/space-integrations/enable`
  );
};

export const useIntegrationDisable = () => {
  return usePost<IntegrationDTO, IntegrationDTO>(
    window._env_.BACKEND_ENDPOINT_URL + `/space-integrations/disable`
  );
};

export const useModerator = (id: string) => {
  return useFetch(window._env_.BACKEND_ENDPOINT_URL + `/space-integrations/${id}/check`, {
    fetchPolicy: 'network-only'
  });
};
