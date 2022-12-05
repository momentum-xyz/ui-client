import {appVariables} from 'api/constants';

export const spaceUserAttributeRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_API_URL}/spaces`;

  return {
    attribute: `${BASE_URL}/:spaceId/:userId/attributes`,
    allUsers: `${BASE_URL}/:spaceId/all-users/attributes`
  };
};
