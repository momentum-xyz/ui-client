import {appVariables} from 'api/constants';

export const spaceRepositoryEndpoints = () => {
  const BASE_URL = `${appVariables.BACKEND_ENDPOINT_URL}/space`;

  return {
    user: `${BASE_URL}/user`,
    edit: `${BASE_URL}/edit`,
    delete: `${BASE_URL}/delete`,
    create: `${BASE_URL}/create`,
    createWithAsset: `${BASE_URL}/create-with-asset`,
    unassignUser: `${BASE_URL}/unassign-user`,
    assignUser: `${BASE_URL}/assign-user`,
    ownedSpaces: `${BASE_URL}/owned-spaces`,
    createInitiative: `${BASE_URL}/create-initiative`,
    search: `${BASE_URL}/search`,
    userSpaceList: `${BASE_URL}/user-spaces/:userId`,
    worldConfig: `${BASE_URL}/:worldId/world-config`
  };
};
