import {appVariables} from 'api/constants';

export const spaceOptionRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces/:spaceId`;

  return {
    effectiveOptions: `${BASE_URL}/effective-options`,
    effectiveSubOption: `${BASE_URL}/effective-options/sub`
  };
};
