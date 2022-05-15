import {useFetch, usePost} from '../../../hooks/api/useApi';

export const useCreateWhitelist = () => {
  return usePost(window._env_.BACKEND_ENDPOINT_URL + '/token-whitelist-request');
};

// @ts-ignore
export const useGetWhitelistRequests = (worldId) => {
  return useFetch<any>(window._env_.BACKEND_ENDPOINT_URL + '/token-whitelist-request/' + worldId, {
    fetchPolicy: 'cache-and-network'
  });
};

// @ts-ignore
export const useGetTokenRules = (spaceId) => {
  return useFetch<any>(window._env_.BACKEND_ENDPOINT_URL + '/token-rule/' + spaceId, {
    fetchPolicy: 'cache-and-network'
  });
};

// @ts-ignore
export const useUpdateTokenStatus = (tokenId) => {
  return usePost(window._env_.BACKEND_ENDPOINT_URL + '/token-whitelist-request/' + tokenId);
};

export const useCreateTokenRule = () => {
  return usePost(window._env_.BACKEND_ENDPOINT_URL + '/token-rule');
};

// @ts-ignore
export const useGetTokens = (worldId) => {
  return useFetch<any>(window._env_.BACKEND_ENDPOINT_URL + '/token/' + worldId, {
    fetchPolicy: 'cache-and-network'
  });
};
