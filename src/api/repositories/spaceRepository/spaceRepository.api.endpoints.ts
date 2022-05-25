import {appVariables} from 'api/constants';

export const spaceRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space`;

  return {
    user: `${BASE_URL}/user`,
    edit: `${BASE_URL}/edit`,
    delete: `${BASE_URL}/delete`,
    create: `${BASE_URL}/create`,
    unassignUser: `${BASE_URL}/unassign-user`,
    assignUser: `${BASE_URL}/assign-user`,
    ownedSpaces: `${BASE_URL}/owned-spaces`,
    createInitiative: `${BASE_URL}/create-initiative`
  };
};
